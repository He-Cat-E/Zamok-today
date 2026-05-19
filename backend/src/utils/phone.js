import {
  parsePhoneNumberFromString,
  isValidPhoneNumber,
  getCountryCallingCode
} from "libphonenumber-js";

/**
 * Build E.164 digits without '+' from ISO country + national number.
 */
export function normalizePhoneFromParts(countryIso, nationalInput) {
  const country = String(countryIso || "")
    .trim()
    .toUpperCase();
  const national = String(nationalInput || "").trim();
  if (!country || !national) return null;

  try {
    const parsed = parsePhoneNumberFromString(national, country);
    if (!parsed || !parsed.isValid()) return null;
    return parsed.number.replace(/\D/g, "").replace(/^\+?/, "");
  } catch {
    return null;
  }
}

/** Legacy: parse full international or messy input without country hint. */
export function normalizePhone(input) {
  const raw = String(input || "").trim();
  if (!raw) return null;

  const withPlus = raw.startsWith("+") ? raw : raw.startsWith("00") ? `+${raw.slice(2)}` : `+${raw.replace(/\D/g, "")}`;

  try {
    const parsed = parsePhoneNumberFromString(withPlus);
    if (!parsed || !parsed.isValid()) return null;
    return parsed.number.replace(/\D/g, "").replace(/^\+?/, "");
  } catch {
    return null;
  }
}

export function isValidPhoneE164(digits) {
  if (!digits || !/^\d{8,15}$/.test(digits)) return false;
  try {
    return isValidPhoneNumber(`+${digits}`);
  } catch {
    return false;
  }
}

export function countryIsoFromE164(digits) {
  try {
    const parsed = parsePhoneNumberFromString(`+${digits}`);
    return parsed?.country || null;
  } catch {
    return null;
  }
}

export function getDialCodeForCountry(countryIso) {
  try {
    return getCountryCallingCode(String(countryIso || "").toUpperCase());
  } catch {
    return null;
  }
}

/** Format for NetGSM `no` field. */
export function phoneForSmsApi(digits) {
  if (!digits) return null;
  const country = countryIsoFromE164(digits);
  if (country === "TR" && digits.startsWith("90") && digits.length === 12) {
    return digits.slice(2);
  }
  return digits;
}
