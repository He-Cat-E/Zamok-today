import { DEFAULT_ADMIN_LANG } from "@/i18n/locales";

/** ISO region codes for flag-icons (aligned with frontend LocalePicker). */
export const LANGUAGE_TO_REGION: Record<string, string> = {
  en: "gb",
  es: "es",
  fr: "fr",
  de: "de",
  it: "it",
  pt: "pt",
  ru: "ru",
  uk: "ua",
  tr: "tr",
  hi: "in",
  ja: "jp",
  zh: "cn",
  nl: "nl",
  sv: "se",
  no: "no",
  da: "dk",
  fi: "fi",
  pl: "pl",
  ro: "ro",
  el: "gr",
  he: "il",
  vi: "vn",
  th: "th",
  id: "id",
  ms: "my"
};

export function languageRegion(code: string): string {
  const base = code.split(/[-_]/)[0]!.toLowerCase();
  return LANGUAGE_TO_REGION[base] ?? base;
}

export function languageDisplayName(code: string, locale = DEFAULT_ADMIN_LANG): string {
  try {
    const dn = new Intl.DisplayNames([locale], { type: "language" });
    return dn.of(code) || code;
  } catch {
    return code;
  }
}
