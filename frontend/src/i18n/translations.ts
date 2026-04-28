// Moved to JSON-per-language in `src/i18n/locales/*.json`.
// Keep this file as a compat re-export so existing imports won't break if any remain.
export { dictionaries as translations, normalizeLanguageTag } from "@/i18n/locales";
export type { SupportedLanguage } from "@/i18n/locales";

