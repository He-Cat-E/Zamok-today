/**
 * Copies insurance.dask.* from en.json into each locale except en and tr.
 * Run from frontend: node tools/sync-dask-locales.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const localesDir = path.join(root, "public", "locales");

const en = JSON.parse(fs.readFileSync(path.join(localesDir, "en.json"), "utf8"));
const daskFromEn = Object.fromEntries(
  Object.entries(en).filter(([k]) => k.startsWith("insurance.dask.") || k.startsWith("insurance.common."))
);

for (const name of fs.readdirSync(localesDir)) {
  if (!name.endsWith(".json") || name === "en.json" || name === "tr.json") continue;
  const filePath = path.join(localesDir, name);
  const loc = JSON.parse(fs.readFileSync(filePath, "utf8"));
  for (const k of Object.keys(loc)) {
    if (k.startsWith("insurance.dask.") || k.startsWith("insurance.common.")) delete loc[k];
  }
  Object.assign(loc, daskFromEn);
  fs.writeFileSync(filePath, JSON.stringify(loc, null, 2) + "\n");
  console.log("updated", name);
}

console.log("Done. tr.json unchanged; other locales use English DASK copy until translated.");
