import en from "@/i18n/locales/en.json";
import ru from "@/i18n/locales/ru.json";
import tr from "@/i18n/locales/tr.json";
import es from "@/i18n/locales/es.json";
import fr from "@/i18n/locales/fr.json";
import de from "@/i18n/locales/de.json";

export const supportedLanguages = ["en", "ru", "tr", "es", "fr", "de"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

export type Dict = Record<string, string>;

export const dictionaries: Record<SupportedLanguage, Dict> = {
  en: en as Dict,
  ru: ru as Dict,
  tr: tr as Dict,
  es: es as Dict,
  fr: fr as Dict,
  de: de as Dict
};

export function normalizeLanguageTag(tag: string): SupportedLanguage {
  const primary = String(tag || "en").split(/[-_]/)[0]!.toLowerCase();
  if (supportedLanguages.includes(primary as SupportedLanguage)) {
    return primary as SupportedLanguage;
  }
  return "en";
}

