import { User } from "../models/User.js";

/** Candidate phone strings for lookup (E.164 digits and legacy formats). */
export function phoneLookupCandidates(e164) {
  const digits = String(e164 || "").replace(/\D/g, "");
  if (!digits) return [];

  const set = new Set([digits, `+${digits}`]);
  if (digits.startsWith("90") && digits.length === 12) {
    set.add(digits.slice(2));
  }
  return [...set];
}

export async function findUserByPhoneE164(e164) {
  const candidates = phoneLookupCandidates(e164);
  if (!candidates.length) return null;

  const user = await User.findOne({ phone: { $in: candidates } });
  if (!user) return null;

  const canonical = String(e164 || "").replace(/\D/g, "");
  if (canonical && user.phone !== canonical) {
    user.phone = canonical;
    await user.save();
  }
  return user;
}

export function duplicateKeyField(err) {
  if (err?.keyPattern && typeof err.keyPattern === "object") {
    const keys = Object.keys(err.keyPattern);
    if (keys.length) return keys[0];
  }
  if (err?.keyValue && typeof err.keyValue === "object") {
    const keys = Object.keys(err.keyValue);
    if (keys.length) return keys[0];
  }
  return null;
}
