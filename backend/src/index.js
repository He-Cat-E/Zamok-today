import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { z } from "zod";

const app = express();

const PORT = Number(process.env.PORT || 4000);
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/zamok_today";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

function safeSupportedValuesOf(type) {
  try {
    // Node 20+ / modern runtimes
    // eslint-disable-next-line no-undef
    const vals = Intl?.supportedValuesOf?.(type);
    return Array.isArray(vals) ? vals : [];
  } catch {
    return [];
  }
}

function flagEmojiFromRegion(regionCode) {
  const code = String(regionCode || "").toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return "🏳️";
  const A = 0x1f1e6;
  return Array.from(code)
    .map((c) => String.fromCodePoint(A + (c.charCodeAt(0) - 65)))
    .join("");
}

const localePreferenceSchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true, unique: true, index: true },
    country: { type: String, required: true },
    language: { type: String, required: true },
    currency: { type: String, required: true }
  },
  { timestamps: true }
);

const LocalePreference =
  mongoose.models.LocalePreference ||
  mongoose.model("LocalePreference", localePreferenceSchema);

const localePreferenceUpsertSchema = z.object({
  deviceId: z.string().min(6).max(128),
  country: z.string().min(2).max(2),
  language: z.string().min(2).max(12),
  currency: z.string().min(3).max(3)
});

app.get("/api/locale/options", (_req, res) => {
  const regionCodes = safeSupportedValuesOf("region");
  const languageTags = safeSupportedValuesOf("language");
  const currencyCodes = safeSupportedValuesOf("currency");

  const regions = (regionCodes.length ? regionCodes : ["US", "GB", "DE", "FR", "IT", "ES"])
    .map((c) => String(c).toUpperCase())
    .filter((c) => /^[A-Z]{2}$/.test(c));

  const languages = (languageTags.length ? languageTags : ["en", "es", "fr", "de", "it", "pt", "ru", "ar", "zh"])
    .map((t) => String(t))
    .map((t) => t.split("-")[0]?.toLowerCase())
    .filter((t) => t && /^[a-z]{2,3}$/.test(t));

  const currencies = (currencyCodes.length ? currencyCodes : ["USD", "EUR", "GBP", "JPY", "CNY"])
    .map((c) => String(c).toUpperCase())
    .filter((c) => /^[A-Z]{3}$/.test(c));

  const regionDN = new Intl.DisplayNames(["en"], { type: "region" });
  const langDN = new Intl.DisplayNames(["en"], { type: "language" });
  let currencyDN;
  try {
    currencyDN = new Intl.DisplayNames(["en"], { type: "currency" });
  } catch {
    currencyDN = null;
  }

  // Deduplicate + sort by display name
  const uniq = (arr) => Array.from(new Set(arr));

  const out = {
    countries: uniq(regions)
      .map((code) => ({
        code,
        name: regionDN.of(code) || code,
        flag: flagEmojiFromRegion(code)
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    languages: uniq(languages)
      .map((code) => ({ code, name: langDN.of(code) || code }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    currencies: uniq(currencies)
      .map((code) => ({ code, name: (currencyDN?.of?.(code) ?? code) || code }))
      .sort((a, b) => a.name.localeCompare(b.name))
  };

  res.json(out);
});

app.get("/api/locale/preferences/:deviceId", async (req, res) => {
  const deviceId = String(req.params.deviceId || "");
  if (deviceId.length < 6 || deviceId.length > 128) {
    return res.status(400).send("Invalid deviceId");
  }
  const pref = await LocalePreference.findOne({ deviceId }).lean();
  if (!pref) return res.json({ preference: null });
  res.json({
    preference: {
      deviceId: pref.deviceId,
      country: pref.country,
      language: pref.language,
      currency: pref.currency
    }
  });
});

app.put("/api/locale/preferences", async (req, res) => {
  const parsed = localePreferenceUpsertSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).send(parsed.error.issues.map((i) => i.message).join(", "));
  }
  const { deviceId, country, language, currency } = parsed.data;
  const pref = await LocalePreference.findOneAndUpdate(
    { deviceId },
    { $set: { country: country.toUpperCase(), language: language.toLowerCase(), currency: currency.toUpperCase() } },
    { upsert: true, new: true }
  ).lean();

  res.json({
    preference: {
      deviceId: pref.deviceId,
      country: pref.country,
      language: pref.language,
      currency: pref.currency
    }
  });
});

const searchSchema = z.object({
  from: z.string().min(2).max(10),
  to: z.string().min(2).max(10),
  departDate: z.string().min(8).max(10),
  returnDate: z.string().min(8).max(10).optional(),
  passengers: z.number().int().min(1).max(9),
  cabin: z.enum(["economy", "premium", "business", "first"])
});

function addMinutes(iso, mins) {
  return new Date(new Date(iso).getTime() + mins * 60 * 1000).toISOString();
}

function mockOffers({ from, to, departDate }) {
  const base = new Date(`${departDate}T09:00:00.000Z`).toISOString();
  const carriers = ["ZA", "ZT", "OK"];
  const makeOffer = (i, price) => {
    const carrier = carriers[i % carriers.length];
    const seg1Dur = 120 + i * 25;
    const seg2Dur = 180 + i * 15;
    const hasStop = i % 2 === 1;
    const departAt = addMinutes(base, i * 45);
    const arriveAt = addMinutes(departAt, hasStop ? seg1Dur + 65 + seg2Dur : seg1Dur + seg2Dur);
    return {
      id: `mock_${departDate}_${i}`,
      price: { amount: price, currency: "USD" },
      segments: hasStop
        ? [
            {
              from,
              to: "CHI",
              departAt,
              arriveAt: addMinutes(departAt, seg1Dur),
              carrier,
              flightNumber: `${carrier}${100 + i}`,
              durationMinutes: seg1Dur,
              stops: 0
            },
            {
              from: "CHI",
              to,
              departAt: addMinutes(departAt, seg1Dur + 65),
              arriveAt,
              carrier,
              flightNumber: `${carrier}${500 + i}`,
              durationMinutes: seg2Dur,
              stops: 0
            }
          ]
        : [
            {
              from,
              to,
              departAt,
              arriveAt,
              carrier,
              flightNumber: `${carrier}${700 + i}`,
              durationMinutes: seg1Dur + seg2Dur,
              stops: 0
            }
          ],
      deepLink: "https://www.aviasales.com/"
    };
  };

  return [makeOffer(0, 219), makeOffer(1, 249), makeOffer(2, 289), makeOffer(3, 315)];
}

app.post("/api/flights/search", async (req, res) => {
  const parsed = searchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).send(parsed.error.issues.map((i) => i.message).join(", "));
  }

  // Placeholder: store searches later (optional) using Mongo.
  const offers = mockOffers(parsed.data);
  res.json({ offers });
});

async function start() {
  await mongoose.connect(MONGODB_URI);
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server:", err);
  process.exitCode = 1;
});

