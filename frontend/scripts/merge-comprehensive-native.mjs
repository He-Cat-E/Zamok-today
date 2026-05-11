/**
 * Merges JSON override files from scripts/comprehensive-i18n-native/<lang>.json
 * into public/locales/<lang>.json (flat key merge).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, "comprehensive-i18n-native");
const localesDir = path.join(__dirname, "..", "public", "locales");

if (!fs.existsSync(srcDir)) {
  console.error("Missing folder:", srcDir);
  process.exit(1);
}

for (const f of fs.readdirSync(srcDir)) {
  if (!f.endsWith(".json")) continue;
  const lang = f.replace(/\.json$/i, "");
  const overridesPath = path.join(srcDir, f);
  const targetPath = path.join(localesDir, `${lang}.json`);
  if (!fs.existsSync(targetPath)) {
    console.warn("Skip (no locale):", lang);
    continue;
  }
  const overrides = JSON.parse(fs.readFileSync(overridesPath, "utf8"));
  const locale = JSON.parse(fs.readFileSync(targetPath, "utf8"));
  for (const [k, v] of Object.entries(overrides)) {
    locale[k] = v;
  }
  fs.writeFileSync(targetPath, JSON.stringify(locale, null, 2) + "\n", "utf8");
  console.log("Merged", Object.keys(overrides).length, "keys ->", lang + ".json");
}
