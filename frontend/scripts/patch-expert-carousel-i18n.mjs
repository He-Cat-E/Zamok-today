/**
 * Adds insurance.comprehensive.expertSlide{1,2,3}{Quote,Name,Role} to locale JSONs.
 * Skips en.json and tr.json (maintained manually). Slide 1 reuses expertQuote + expertRole; slides 2–3 use English copy.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, "..", "public", "locales");

const SLIDE2 = {
  quote:
    "Deductibles and approved repair networks matter as much as the headline premium — compare like for like before you bind cover.",
  name: "Ayşe Demir",
  role: "Customer advisory — İlsa Insurance"
};

const SLIDE3 = {
  quote:
    "At renewal, revisit mileage, where you park, and any accessories — small changes often mean your cover should change too.",
  name: "Can Öztürk",
  role: "Renewals specialist — İlsa Insurance"
};

const skip = new Set(["en.json", "tr.json"]);

for (const f of fs.readdirSync(localesDir)) {
  if (!f.endsWith(".json") || skip.has(f)) continue;
  const p = path.join(localesDir, f);
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  const q = j["insurance.comprehensive.expertQuote"];
  const role = j["insurance.comprehensive.expertRole"];
  if (typeof q !== "string" || typeof role !== "string") {
    console.warn("Skip (missing expert keys):", f);
    continue;
  }
  j["insurance.comprehensive.expertSlide1Quote"] = q;
  j["insurance.comprehensive.expertSlide1Name"] = "Mehmet Yılmaz";
  j["insurance.comprehensive.expertSlide1Role"] = role;
  j["insurance.comprehensive.expertSlide2Quote"] = SLIDE2.quote;
  j["insurance.comprehensive.expertSlide2Name"] = SLIDE2.name;
  j["insurance.comprehensive.expertSlide2Role"] = SLIDE2.role;
  j["insurance.comprehensive.expertSlide3Quote"] = SLIDE3.quote;
  j["insurance.comprehensive.expertSlide3Name"] = SLIDE3.name;
  j["insurance.comprehensive.expertSlide3Role"] = SLIDE3.role;
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n", "utf8");
  console.log("Patched", f);
}
