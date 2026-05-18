/**
 * Merges auth / profile / wallet strings from en.json into all locale files.
 * Turkish (tr.json): only adds keys that are missing (keeps existing TR copy).
 *
 * From frontend: npm run i18n:auth
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pickAuthStringsFromEn } from "./auth-i18n-keys.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, "..", "public", "locales");

const en = JSON.parse(fs.readFileSync(path.join(localesDir, "en.json"), "utf8"));
const fromEn = pickAuthStringsFromEn(en);

let updated = 0;
for (const name of fs.readdirSync(localesDir)) {
  if (!name.endsWith(".json") || name === "en.json") continue;
  const filePath = path.join(localesDir, name);
  const loc = JSON.parse(fs.readFileSync(filePath, "utf8"));
  let changed = false;

  for (const [key, value] of Object.entries(fromEn)) {
    if (name === "tr.json" && key in loc) continue;
    if (loc[key] !== value) {
      loc[key] = value;
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(loc, null, 2) + "\n");
    console.log("updated", name, `(${Object.keys(fromEn).length} auth keys)`);
    updated += 1;
  }
}

console.log(`Done. ${updated} locale file(s) updated; tr.json keeps existing Turkish where present.`);
