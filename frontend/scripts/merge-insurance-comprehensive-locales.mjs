/**
 * Merges insurance.comprehensive.* strings from en.json into every locale file
 * (only adds keys that are missing, so tr.json etc. keep existing translations).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, "..", "public", "locales");
const enPath = path.join(localesDir, "en.json");
const en = JSON.parse(fs.readFileSync(enPath, "utf8"));
const comprehensive = Object.fromEntries(
  Object.entries(en).filter(([k]) => k.startsWith("insurance.comprehensive."))
);
const files = fs.readdirSync(localesDir).filter((f) => f.endsWith(".json"));

let totalAdded = 0;
for (const f of files) {
  const p = path.join(localesDir, f);
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  let added = 0;
  for (const [k, v] of Object.entries(comprehensive)) {
    if (j[k] === undefined) {
      j[k] = v;
      added++;
    }
  }
  if (added > 0) {
    fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n", "utf8");
    console.log(`${f}: +${added} keys`);
    totalAdded += added;
  }
}
console.log(`Done. Added ${totalAdded} key instances across files.`);
