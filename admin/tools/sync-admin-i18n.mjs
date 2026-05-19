/**
 * Generates admin/public/locales/<lang>.json for every supported language.
 * From admin: npm run i18n:sync
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildAdminDict } from "./admin-i18n-phrases.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, "..", "public", "locales");

const LANGS = [
  "da","de","el","en","es","fi","fr","he","hi","id","it","ja","ms","nl","no","pl","pt","ro","ru","sv","th","tr","uk","vi","zh"
];

if (!fs.existsSync(localesDir)) fs.mkdirSync(localesDir, { recursive: true });

for (const lang of LANGS) {
  const dict = buildAdminDict(lang);
  const filePath = path.join(localesDir, `${lang}.json`);
  fs.writeFileSync(filePath, JSON.stringify(dict, null, 2) + "\n");
  console.log("wrote", `${lang}.json`);
}

console.log(`Done. ${LANGS.length} locale file(s).`);
