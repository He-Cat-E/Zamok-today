/**
 * Copies insurance.supplementaryHealth.* and insurance.common.* from en.json
 * into each locale except en and tr. Turkish (tr) is maintained by seed-supplementary-health-i18n.mjs.
 * Run from frontend: node tools/sync-supplementary-health-locales.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const localesDir = path.join(root, "public", "locales");

const en = JSON.parse(fs.readFileSync(path.join(localesDir, "en.json"), "utf8"));
const fromEn = Object.fromEntries(
  Object.entries(en).filter(
    ([k]) =>
      k.startsWith("insurance.supplementaryHealth.") ||
      k.startsWith("insurance.common.") ||
      k === "insurance.health.supplementaryPageLink"
  )
);

for (const name of fs.readdirSync(localesDir)) {
  if (!name.endsWith(".json") || name === "en.json" || name === "tr.json") continue;
  const filePath = path.join(localesDir, name);
  const loc = JSON.parse(fs.readFileSync(filePath, "utf8"));
  for (const k of Object.keys(loc)) {
    if (
      k.startsWith("insurance.supplementaryHealth.") ||
      k.startsWith("insurance.common.") ||
      k === "insurance.health.supplementaryPageLink"
    ) {
      delete loc[k];
    }
  }
  Object.assign(loc, fromEn);
  fs.writeFileSync(filePath, JSON.stringify(loc, null, 2) + "\n");
  console.log("updated", name);
}

console.log("Done. tr.json unchanged; other locales use English supplementary-health copy until translated.");
