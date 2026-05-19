import { User } from "../models/User.js";
import {
  phoneSendCodeSchema,
  phoneLoginSchema,
  phoneRegisterSchema,
  formatZodError
} from "../validators/auth.validator.js";
import {
  parsePhoneOrThrow,
  sendPhoneVerificationCode,
  verifyPhoneCode
} from "../services/phoneOtp.service.js";
import { getOrCreateWalletForUser } from "../services/wallet.service.js";
import {
  signAuthToken,
  authCookieOptions,
  getAuthCookieName
} from "../utils/authTokens.js";
import { findUserByPhoneE164, duplicateKeyField } from "../utils/userLookup.js";
import { assertUserCanAuthenticate } from "../utils/accountStatus.js";

function setAuthCookie(res, userId) {
  const token = signAuthToken(userId);
  res.cookie(getAuthCookieName(), token, authCookieOptions());
}

function normalizeFullName(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ");
}

async function signInExistingPhoneUser(res, user, { fullNameNorm } = {}) {
  assertUserCanAuthenticate(user);

  if (fullNameNorm && fullNameNorm.length >= 2) {
    user.fullName = fullNameNorm;
  }
  if (!user.phoneVerified) {
    user.phoneVerified = true;
  }
  if (user.authMethod !== "phone") {
    user.authMethod = "phone";
  }
  await user.save();
  setAuthCookie(res, user._id);
  return res.json({
    user: user.toPublicJSON(),
    message: "Signed in successfully",
    existingAccount: true
  });
}

export async function sendPhoneCode(req, res) {
  const parsed = phoneSendCodeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: formatZodError(parsed.error) });
  }

  const { country, phone: national, purpose } = parsed.data;

  try {
    const phone = parsePhoneOrThrow(country, national);
    const existingUser = await findUserByPhoneE164(phone);

    if (purpose === "login") {
      if (!existingUser?.phone) {
        return res.status(404).json({
          error: "No account found for this phone number",
          code: "PHONE_NOT_FOUND"
        });
      }
      try {
        assertUserCanAuthenticate(existingUser);
      } catch (err) {
        return res.status(err.status || 403).json({
          error: err.message,
          ...(err.code ? { code: err.code } : {})
        });
      }
    }

    const existingAccount = purpose === "register" && Boolean(existingUser);

    const result = await sendPhoneVerificationCode({ country, phone: national });
    return res.json({
      ...result,
      ...(existingAccount ? { existingAccount: true } : {})
    });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message || "Could not send verification code" });
  }
}

export async function loginWithPhone(req, res) {
  const parsed = phoneLoginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: formatZodError(parsed.error) });
  }

  const { country, phone: national, code } = parsed.data;

  try {
    const phone = await verifyPhoneCode({ country, phone: national, code });
    const user = await findUserByPhoneE164(phone);

    if (!user?.phone) {
      return res.status(404).json({
        error: "No account found for this phone number",
        code: "PHONE_NOT_FOUND"
      });
    }

    return signInExistingPhoneUser(res, user);
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({
      error: err.message || "Phone sign-in failed",
      ...(err.code ? { code: err.code } : {})
    });
  }
}

export async function registerWithPhone(req, res) {
  const parsed = phoneRegisterSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: formatZodError(parsed.error) });
  }

  const { fullName, country, phone: national, code } = parsed.data;
  const fullNameNorm = normalizeFullName(fullName);

  try {
    const phone = await verifyPhoneCode({ country, phone: national, code });
    const existing = await findUserByPhoneE164(phone);

    if (existing) {
      return signInExistingPhoneUser(res, existing, { fullNameNorm });
    }

    let user;
    try {
      user = await User.create({
        fullName: fullNameNorm,
        phone,
        authMethod: "phone",
        phoneVerified: true,
        emailVerified: true
      });
    } catch (err) {
      if (err?.code === 11000) {
        const dup = await findUserByPhoneE164(phone);
        if (dup) {
          return signInExistingPhoneUser(res, dup, { fullNameNorm });
        }
        const field = duplicateKeyField(err);
        if (field === "phone") {
          return res.status(409).json({
            error: "An account with this phone number already exists. Please sign in instead.",
            code: "PHONE_ALREADY_REGISTERED"
          });
        }
        return res.status(409).json({
          error: "Could not create account. Please try again or sign in with email.",
          code: "REGISTRATION_CONFLICT"
        });
      }
      throw err;
    }

    setAuthCookie(res, user._id);

    void getOrCreateWalletForUser(user._id).catch((e) => {
      // eslint-disable-next-line no-console
      console.error("[wallet] Failed to create wallet:", e?.message || e);
    });

    return res.status(201).json({
      user: user.toPublicJSON(),
      message: "Account created successfully"
    });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({
      error: err.message || "Registration failed",
      ...(err.code ? { code: err.code } : {})
    });
  }
}
