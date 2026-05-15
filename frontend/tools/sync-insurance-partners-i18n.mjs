/**
 * Copies shared partner-strip strings from en.json into every locale except en and tr.
 * Turkish (tr) keeps its own copy. Run before machine translation.
 *
 * From frontend: node tools/sync-insurance-partners-i18n.mjs
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
      k === "insurance.partnersTitle" ||
      k === "insurance.partnersSubtitle" ||
      k.startsWith("insurance.partner.")
  )
);

for (const name of fs.readdirSync(localesDir)) {
  if (!name.endsWith(".json") || name === "en.json" || name === "tr.json") continue;
  const filePath = path.join(localesDir, name);
  const loc = JSON.parse(fs.readFileSync(filePath, "utf8"));
  Object.assign(loc, fromEn);
  fs.writeFileSync(filePath, JSON.stringify(loc, null, 2) + "\n");
  console.log("updated", name);
}

console.log("Done. tr.json unchanged; merged partner keys from en.json into other locales.");
