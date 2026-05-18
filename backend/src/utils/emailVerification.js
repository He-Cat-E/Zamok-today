import { createResetToken, hashResetToken } from "./authTokens.js";

export const VERIFICATION_TOKEN_MS = 24 * 60 * 60 * 1000;

export function hashVerificationToken(token) {
  return hashResetToken(token);
}

export function createVerificationToken() {
  return createResetToken();
}

export async function assignVerificationToken(user) {
  const rawToken = createVerificationToken();
  user.emailVerificationTokenHash = hashVerificationToken(rawToken);
  user.emailVerificationExpires = new Date(Date.now() + VERIFICATION_TOKEN_MS);
  await user.save();
  return rawToken;
}
