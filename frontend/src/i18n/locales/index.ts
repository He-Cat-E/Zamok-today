/**
 * Locale JSON files live in `public/locales/<code>.json` and are fetched at runtime
 * by `I18nProvider`. Keep `supportedLanguages` in sync with files on disk.
 */
export const supportedLanguages = [
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

export type SupportedLanguage = (typeof supportedLanguages)[number];

export type Dict = Record<string, string>;

export function normalizeLanguageTag(tag: string): SupportedLanguage {
  const raw = String(tag || "tr").split(/[-_]/)[0]!.toLowerCase() || "tr";
  if (supportedLanguages.includes(raw as SupportedLanguage)) {
    return raw as SupportedLanguage;
  }
  return "en";
}
