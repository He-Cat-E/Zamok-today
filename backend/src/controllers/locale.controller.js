import { LocalePreference } from "../models/LocalePreference.js";
import { localePreferenceUpsertSchema } from "../validators/locale.validator.js";
import { flagEmojiFromRegion, safeSupportedValuesOf } from "../utils/intlHelpers.js";

function parseWhereAmIJsonp(payload) {
  const text = String(payload || "").trim();
  const start = text.indexOf("(");
  const end = text.lastIndexOf(")");
  if (start === -1 || end === -1 || end <= start) return null;
  const json = text.slice(start + 1, end);
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function clientIpFromRequest(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)[0];
  const candidate = forwarded || req.ip || req.socket?.remoteAddress || "";
  const ip = String(candidate).replace(/^::ffff:/, "").trim();
  if (!ip || ip === "::1" || ip === "127.0.0.1") return "";
  return ip;
}

export function getOptions(_req, res) {
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
}

export async function getWhereAmI(req, res) {
  try {
    const locale = String(req.query.locale || "en")
      .split("-")[0]
      .toLowerCase();
    const callback = "useriata";
    const ip = clientIpFromRequest(req);
    const url = new URL("https://www.travelpayouts.com/whereami");
    url.searchParams.set("locale", locale);
    url.searchParams.set("callback", callback);
    if (ip) url.searchParams.set("ip", ip);

    const headers = {};
    if (process.env.TRAVELPAYOUTS_API_TOKEN) {
      headers["x-access-token"] = process.env.TRAVELPAYOUTS_API_TOKEN;
    }

    const tpRes = await fetch(url.toString(), { headers });
    if (!tpRes.ok) {
      return res.status(502).json({
        error: "Travelpayouts whereami request failed",
        status: tpRes.status
      });
    }

    const payload = await tpRes.text();
    const parsed = parseWhereAmIJsonp(payload);
    if (!parsed || typeof parsed !== "object") {
      return res.status(502).json({ error: "Invalid whereami response" });
    }

    return res.json({
      cityIata: parsed.iata || null,
      cityName: parsed.name || null,
      countryCode: parsed.country_code || null,
      countryName: parsed.country_name || null,
      coordinates: parsed.coordinates || null
    });
  } catch (err) {
    return res.status(502).json({
      error: "Failed to load whereami",
      detail: err instanceof Error ? err.message : "unknown_error"
    });
  }
}

export async function getPreference(req, res) {
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
}

export async function upsertPreference(req, res) {
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
}
