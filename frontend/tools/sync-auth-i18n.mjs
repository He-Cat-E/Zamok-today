/**
 * Merges auth / profile / wallet strings from en.json into all locale files.
 * - profile.* keys: localized via profile-i18n-translations.mjs (tr.json keeps existing TR copy).
 * - other auth keys: English fallback from en.json (tr.json keeps existing where present).
 *
 * From frontend: npm run i18n:auth
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pickAuthStringsFromEn } from "./auth-i18n-keys.mjs";
import { profileTranslations } from "./profile-i18n-translations.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, "..", "public", "locales");

const en = JSON.parse(fs.readFileSync(path.join(localesDir, "en.json"), "utf8"));
const fromEn = pickAuthStringsFromEn(en);

function resolveValue(key, enValue, lang, fileName, loc) {
  if (fileName === "tr.json" && key in loc) return loc[key];

  if (key.startsWith("profile.")) {
    const translated = profileTranslations[lang]?.[key];
    if (translated) return translated;
  }

  return enValue;
}

let updated = 0;
for (const name of fs.readdirSync(localesDir)) {
  if (!name.endsWith(".json") || name === "en.json") continue;
  const filePath = path.join(localesDir, name);
  const lang = name.replace(/\.json$/, "");
  const loc = JSON.parse(fs.readFileSync(filePath, "utf8"));
  let changed = false;

  for (const [key, enValue] of Object.entries(fromEn)) {
    const value = resolveValue(key, enValue, lang, name, loc);
    if (loc[key] !== value) {
      loc[key] = value;
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(loc, null, 2) + "\n");
    console.log("updated", name);
    updated += 1;
  }
}

console.log(`Done. ${updated} locale file(s) updated.`);
