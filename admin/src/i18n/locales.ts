/**
 * Keep in sync with `frontend/src/i18n/locales/index.ts` and locale JSON files on disk.
 */
export const ADMIN_SUPPORTED_LANGUAGES = [
  "da",
  "de",
  "el",
  "en",
  "es",
  "fi",
  "fr",
  "he",
  "hi",
  "id",
  "it",
  "ja",
  "ms",
  "nl",
  "no",
  "pl",
  "pt",
  "ro",
  "ru",
  "sv",
  "th",
  "tr",
  "uk",
  "vi",
  "zh"
] as const;

export type AdminLangCode = (typeof ADMIN_SUPPORTED_LANGUAGES)[number];

const SUPPORTED = new Set<string>(ADMIN_SUPPORTED_LANGUAGES);

export function normalizeAdminLang(tag: string): AdminLangCode {
  const base = String(tag || "en").split(/[-_]/)[0]!.toLowerCase();
  if (SUPPORTED.has(base)) return base as AdminLangCode;
  return "en";
}
