import crypto from "node:crypto";
import { PhoneOtp, PHONE_OTP_PURPOSE } from "../models/PhoneOtp.js";
import { isValidPhoneE164, normalizePhoneFromParts } from "../utils/phone.js";
import { sendPhoneOtpSms } from "./netgsm.service.js";
import {
  isNetgsmConfigured,
  isNetgsmDevFallbackAllowed,
  shouldExposePhoneOtpInResponse
} from "../config/netgsm.js";

const OTP_TTL_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_SENDS_PER_HOUR = 5;
const MAX_VERIFY_ATTEMPTS = 5;

function hashOtp(code) {
  return crypto.createHash("sha256").update(String(code)).digest("hex");
}

function generateOtpCode() {
  return String(crypto.randomInt(100_000, 1_000_000));
}

export function parsePhoneOrThrow(countryIso, nationalInput) {
  const phone = normalizePhoneFromParts(countryIso, nationalInput);
  if (!phone || !isValidPhoneE164(phone)) {
    const err = new Error("Enter a valid mobile phone number");
    err.status = 400;
    throw err;
  }
  return phone;
}

export async function sendPhoneVerificationCode({ country, phone: national }) {
  const phone = parsePhoneOrThrow(country, national);
  const purpose = PHONE_OTP_PURPOSE;

  const existing = await PhoneOtp.findOne({ phone, purpose });
  const now = Date.now();

  if (existing?.lastSentAt && now - existing.lastSentAt.getTime() < RESEND_COOLDOWN_MS) {
    const waitSec = Math.ceil((RESEND_COOLDOWN_MS - (now - existing.lastSentAt.getTime())) / 1000);
    const err = new Error(`Please wait ${waitSec} seconds before requesting a new code`);
    err.status = 429;
    throw err;
  }

  if (existing?.sendCount >= MAX_SENDS_PER_HOUR && existing.createdAt > new Date(now - 60 * 60 * 1000)) {
    const err = new Error("Too many verification attempts. Try again later.");
    err.status = 429;
    throw err;
  }

  const code = generateOtpCode();
  const codeHash = hashOtp(code);
  const expiresAt = new Date(now + OTP_TTL_MS);

  await PhoneOtp.findOneAndUpdate(
    { phone, purpose },
    {
      codeHash,
      expiresAt,
      attempts: 0,
      lastSentAt: new Date(now),
      sendCount: existing ? existing.sendCount + 1 : 1
    },
    { upsert: true, new: true }
  );

  let devOtp;
  if (isNetgsmConfigured()) {
    try {
      await sendPhoneOtpSms({ phoneDigits: phone, code });
    } catch (err) {
      if (err?.devFallback && isNetgsmDevFallbackAllowed()) {
        // eslint-disable-next-line no-console
        console.warn(
          `[netgsm] SMS auth failed (code 30). Dev fallback — OTP for ${phone} (${purpose}): ${code}`
        );
        if (err.publicIp) {
          // eslint-disable-next-line no-console
          console.warn(`[netgsm] Whitelist this IP in NetGSM API settings: ${err.publicIp}`);
        }
        if (shouldExposePhoneOtpInResponse()) {
          devOtp = code;
        } else {
          const e = new Error(
            "NetGSM rejected API credentials (code 30). Enable API access and IP whitelist in NetGSM panel."
          );
          e.status = 503;
          throw e;
        }
      } else {
        // eslint-disable-next-line no-console
        console.error("[netgsm] SMS send failed:", err?.message || err);
        if (Array.isArray(err?.attempts)) {
          // eslint-disable-next-line no-console
          console.error("[netgsm] attempts:", err.attempts.join(" | "));
        }
        if (err?.publicIp) {
          // eslint-disable-next-line no-console
          console.error(`[netgsm] Whitelist public IP in NetGSM: ${err.publicIp}`);
        }
        const e = new Error(
          err?.message || "We could not send the verification SMS. Please try again shortly."
        );
        e.status = 503;
        throw e;
      }
    }
  } else {
    // eslint-disable-next-line no-console
    console.warn(`[auth] NetGSM not configured. OTP for ${phone} (${purpose}): ${code}`);
    if (shouldExposePhoneOtpInResponse()) {
      devOtp = code;
    } else {
      const e = new Error("SMS verification is not available right now. Please use email sign-in.");
      e.status = 503;
      throw e;
    }
  }

  return {
    message: "Verification code sent",
    expiresInSeconds: Math.round(OTP_TTL_MS / 1000),
    ...(devOtp
      ? { devOtp, devNote: "NetGSM is not configured or dev mode enabled; code included for local testing." }
      : {})
  };
}

async function findOtpRecord(phone, purpose) {
  const purposes =
    purpose === PHONE_OTP_PURPOSE
      ? [PHONE_OTP_PURPOSE, "login", "register"]
      : [purpose, PHONE_OTP_PURPOSE, "login", "register"];
  const unique = [...new Set(purposes)];

  for (const p of unique) {
    const record = await PhoneOtp.findOne({ phone, purpose: p }).sort({ updatedAt: -1 });
    if (record) return record;
  }
  return null;
}

export async function verifyPhoneCode({ country, phone: national, code }) {
  const phone = parsePhoneOrThrow(country, national);
  const codeStr = String(code || "").trim();
  if (!/^\d{6}$/.test(codeStr)) {
    const err = new Error("Enter the 6-digit verification code");
    err.status = 400;
    throw err;
  }

  const record = await findOtpRecord(phone, PHONE_OTP_PURPOSE);
  if (!record || record.expiresAt <= new Date()) {
    const err = new Error("Verification code is invalid or has expired");
    err.status = 400;
    throw err;
  }

  if (record.attempts >= MAX_VERIFY_ATTEMPTS) {
    const err = new Error("Too many incorrect attempts. Request a new code.");
    err.status = 429;
    throw err;
  }

  const ok = record.codeHash === hashOtp(codeStr);
  if (!ok) {
    record.attempts += 1;
    await record.save();
    const err = new Error("Verification code is incorrect");
    err.status = 400;
    throw err;
  }

  await PhoneOtp.deleteOne({ _id: record._id });
  return phone;
}
