/**
 * Translates insurance.partners* and insurance.partner.* from English into each
 * locale JSON (except en + tr).
 *
 * Run from frontend: npm run i18n:translate-insurance-partners
 * Resume: npm run i18n:translate-insurance-partners -- de fr
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { batchTranslate, translate } from "google-translate-api-x";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const localesDir = path.join(root, "public", "locales");

const KEYS = [
  "insurance.partnersTitle",
  "insurance.partnersSubtitle",
  "insurance.partner.hepIyi",
  "insurance.partner.mapfre",
  "insurance.partner.sompo",
  "insurance.partner.doga",
  "insurance.partner.quick"
];

const LOCALE_TO_GOOGLE = {
  da: "da",
  de: "de",
  el: "el",
  es: "es",
  fi: "fi",
  fr: "fr",
  he: "he",
  hi: "hi",
  id: "id",
  it: "it",
  ja: "ja",
  ms: "ms",
  nl: "nl",
  no: "no",
  pl: "pl",
  pt: "pt",
  ro: "ro",
  ru: "ru",
  sv: "sv",
  th: "th",
  uk: "uk",
  vi: "vi",
  zh: "zh-CN"
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const BATCH_SIZE = 8;
const BETWEEN_BATCH_MS = 450;
const RETRIES = 4;

async function translateBatchWithRetry(strings, googleTo) {
  let lastErr;
  for (let attempt = 0; attempt < RETRIES; attempt++) {
    try {
      const res = await batchTranslate(strings, {
        from: "en",
        to: googleTo,
        client: "gtx",
        rejectOnPartialFail: false
      });
      return strings.map((src, i) => {
        const item = res[i];
        const out = item && typeof item === "object" && "text" in item ? item.text : null;
        return out != null && out !== "" ? out : src;
      });
    } catch (e) {
      lastErr = e;
      await sleep(800 * (attempt + 1));
    }
  }
  const out = [];
  for (const s of strings) {
    try {
      const r = await translate(s, { from: "en", to: googleTo, client: "gtx" });
      out.push(r.text || s);
    } catch {
      out.push(s);
    }
    await sleep(120);
  }
  console.warn("batch fallback used:", lastErr?.message);
  return out;
}

async function translateLocale(fileBase, googleTo) {
  const name = `${fileBase}.json`;
  const filePath = path.join(localesDir, name);
  if (!fs.existsSync(filePath)) {
    console.warn("skip (missing file):", name);
    return;
  }

  const en = JSON.parse(fs.readFileSync(path.join(localesDir, "en.json"), "utf8"));
  const entries = KEYS.map((k) => [k, en[k]]).filter(([, v]) => typeof v === "string");

  const updates = {};
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const slice = entries.slice(i, i + BATCH_SIZE);
    const keys = slice.map(([k]) => k);
    const strings = slice.map(([, v]) => v);
    const translated = await translateBatchWithRetry(strings, googleTo);
    keys.forEach((k, j) => {
      updates[k] = translated[j];
    });
    process.stdout.write(`\r${fileBase}: ${Math.min(i + BATCH_SIZE, entries.length)}/${entries.length}`);
    await sleep(BETWEEN_BATCH_MS);
  }
  console.log();

  const loc = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const merged = { ...loc, ...updates };
  fs.writeFileSync(filePath, JSON.stringify(merged, null, 2) + "\n");
  console.log("wrote", name);
}

async function main() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith("-"));
  const all = Object.entries(LOCALE_TO_GOOGLE);
  const targets =
    args.length > 0
      ? args.flatMap((a) => {
          const base = a.replace(/\.json$/i, "");
          const googleTo = LOCALE_TO_GOOGLE[base];
          if (!googleTo) {
            console.warn("skip unknown locale:", a);
            return [];
          }
          return [[base, googleTo]];
        })
      : all;

  if (targets.length === 0) {
    console.error("No locales. Usage: node scripts/translate-insurance-partners-i18n.mjs [de fr ...]");
    process.exit(1);
  }

  for (const [fileBase, googleTo] of targets) {
    console.log("\n---", fileBase, "→", googleTo, "---");
    await translateLocale(fileBase, googleTo);
  }
  console.log("\nDone. en.json and tr.json were not modified.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
