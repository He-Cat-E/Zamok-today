import { isMailConfigured } from "../config/mail.js";

/** When SMTP is not set, dev can still test auth emails via API response / console. */
export function shouldExposeDevLinkInResponse() {
  return !isMailConfigured() && process.env.NODE_ENV !== "production";
}

export const shouldExposeResetLinkInResponse = shouldExposeDevLinkInResponse;
export const shouldExposeVerifyLinkInResponse = shouldExposeDevLinkInResponse;

export function logResetLinkDev(email, resetUrl) {
  // eslint-disable-next-line no-console
  console.log(`[auth][dev] Password reset for ${email}: ${resetUrl}`);
}

export function logVerifyLinkDev(email, verifyUrl) {
  // eslint-disable-next-line no-console
  console.log(`[auth][dev] Email verification for ${email}: ${verifyUrl}`);
}
