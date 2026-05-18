import { getClientOrigin, isMailConfigured } from "../config/mail.js";
import { sendVerifyEmail } from "../mail/send.js";
import { VERIFICATION_TOKEN_MS } from "./emailVerification.js";
import { logVerifyLinkDev, shouldExposeVerifyLinkInResponse } from "./mailDevFallback.js";

export function buildVerifyUrl(rawToken) {
  const clientOrigin = getClientOrigin();
  return `${clientOrigin}/verify-email?token=${rawToken}`;
}

/**
 * Sends verification email when SMTP is configured.
 * @returns {{ sent: boolean, verifyUrl?: string, devNote?: string }}
 */
export async function deliverVerificationEmail({ user, rawToken }) {
  const verifyUrl = buildVerifyUrl(rawToken);
  const expiresHours = Math.round(VERIFICATION_TOKEN_MS / 3_600_000);

  if (isMailConfigured()) {
    try {
      await sendVerifyEmail({
        to: user.email,
        fullName: user.getFullName(),
        verifyUrl,
        expiresHours
      });
      return { sent: true };
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[mail] Verification email failed:", err?.message || err);
      if (shouldExposeVerifyLinkInResponse()) {
        logVerifyLinkDev(user.email, verifyUrl);
        return {
          sent: false,
          verifyUrl,
          devNote: "SMTP send failed; verification link included for local debugging."
        };
      }
      throw err;
    }
  }

  if (shouldExposeVerifyLinkInResponse()) {
    logVerifyLinkDev(user.email, verifyUrl);
    return {
      sent: false,
      verifyUrl,
      devNote: "SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in .env to send real emails."
    };
  }

  // eslint-disable-next-line no-console
  console.warn(`[auth] Verification for ${user.email} but SMTP is not configured.`);
  return { sent: false };
}
