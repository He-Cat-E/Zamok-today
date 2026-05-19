import {
  parsePhoneNumberFromString,
  getCountryCallingCode,
  type CountryCode
} from "libphonenumber-js";

export function dialCodeForCountry(iso2: string): string {
  try {
    return getCountryCallingCode(iso2.toUpperCase() as CountryCode);
  } catch {
    return "";
  }
}

export function formatDialCode(iso2: string): string {
  const code = dialCodeForCountry(iso2);
  return code ? `+${code}` : "+";
}

/** E.164 digits without '+'. */
export function buildE164Digits(countryIso: string, national: string): string | null {
  const country = String(countryIso || "")
    .trim()
    .toUpperCase();
  const raw = String(national || "").trim();
  if (!country || !raw) return null;

  try {
    const parsed = parsePhoneNumberFromString(raw, country as CountryCode);
    if (!parsed?.isValid()) return null;
    return parsed.number.replace("+", "");
  } catch {
    return null;
  }
}

export function formatPhoneDisplay(e164Digits: string): string {
  try {
    const parsed = parsePhoneNumberFromString(`+${e164Digits}`);
    if (parsed) return parsed.formatInternational();
  } catch {
    // ignore
  }
  return `+${e164Digits}`;
}
