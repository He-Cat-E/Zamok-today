import { flightSearchSchema } from "../validators/flight.validator.js";

const AIRPORTS_DATA_URL = "https://api.travelpayouts.com/data/en/airports.json";
const CITIES_DATA_URL = "https://api.travelpayouts.com/data/en/cities.json";
const AIRLINES_DATA_URL = "https://api.travelpayouts.com/data/en/airlines.json";
const CITY_DIRECTIONS_URL = "https://api.travelpayouts.com/v1/city-directions";
const PRICES_LATEST_URL = "https://api.travelpayouts.com/v2/prices/latest";
const PRICES_CALENDAR_URL = "https://api.travelpayouts.com/v1/prices/calendar";
const AIRPORTS_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

let airportsCache = {
  expiresAt: 0,
  byIata: new Map(),
  defaultOriginByCountry: new Map(),
  candidatesByCountry: new Map()
};

let citiesCache = {
  expiresAt: 0,
  byIata: new Map()
};

let airlinesCache = {
  expiresAt: 0,
  list: []
};

function parseNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function parseBooleanLike(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (!normalized) return false;
    if (["1", "true", "yes", "y", "included"].includes(normalized)) return true;
    if (["0", "false", "no", "n", "none"].includes(normalized)) return false;
  }
  return false;
}

function buildTpHeaders() {
  const headers = { accept: "application/json" };
  const token = String(process.env.TRAVELPAYOUTS_API_TOKEN || "").trim();
  if (token) headers["x-access-token"] = token;
  return headers;
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function resolveIataByCityName(input, airportData, cityData) {
  const code = String(input || "")
    .trim()
    .toUpperCase();
  if (/^[A-Z]{3}$/.test(code)) return code;
  const normalized = normalizeText(input);
  if (!normalized) return "";

  for (const [iata, city] of cityData.entries()) {
    if (normalizeText(city?.cityName) === normalized) return iata;
  }
  for (const [iata, airport] of airportData.byIata.entries()) {
    if (normalizeText(airport?.cityName) === normalized) return iata;
  }
  for (const [iata, city] of cityData.entries()) {
    if (normalizeText(city?.cityName).includes(normalized) || normalized.includes(normalizeText(city?.cityName))) {
      return iata;
    }
  }
  return "";
}

async function loadAirportsByIata() {
  const now = Date.now();
  if (airportsCache.byIata.size && airportsCache.expiresAt > now) {
    return airportsCache;
  }

  const res = await fetch(AIRPORTS_DATA_URL, {
    headers: { accept: "application/json" }
  });
  if (!res.ok) throw new Error(`airports fetch failed (${res.status})`);
  const raw = await res.json();
  const list = Array.isArray(raw) ? raw : [];
  const byIata = new Map();
  const countryOrigins = new Map();
  const candidatesByCountry = new Map();
  for (const item of list) {
    const airportIata = String(item?.code || item?.iata || "")
      .trim()
      .toUpperCase();
    const cityIata = String(item?.city_code || item?.cityCode || "")
      .trim()
      .toUpperCase();
    const countryCode = String(item?.country_code || item?.countryCode || "")
      .trim()
      .toUpperCase();
    if (!airportIata || !countryCode) continue;
    byIata.set(airportIata, {
      countryCode,
      cityName: String(item?.name || item?.city || item?.city_name || "").trim(),
      cityCode: /^[A-Z]{3}$/.test(cityIata) ? cityIata : "",
      lat:
        parseNumber(item?.coordinates?.lat) ??
        parseNumber(item?.latitude) ??
        parseNumber(item?.lat) ??
        parseNumber(String(item?.coordinates || "").split(",")[0]),
      lng:
        parseNumber(item?.coordinates?.lon) ??
        parseNumber(item?.longitude) ??
        parseNumber(item?.lon) ??
        parseNumber(item?.lng) ??
        parseNumber(String(item?.coordinates || "").split(",")[1])
    });
    const preferred = /^[A-Z]{3}$/.test(cityIata) ? cityIata : airportIata;
    const currentCandidates = candidatesByCountry.get(countryCode) || new Set();
    if (/^[A-Z]{3}$/.test(cityIata)) currentCandidates.add(cityIata);
    currentCandidates.add(airportIata);
    candidatesByCountry.set(countryCode, currentCandidates);
    const current = countryOrigins.get(countryCode);
    if (!current || preferred < current) {
      countryOrigins.set(countryCode, preferred);
    }
  }

  airportsCache = {
    byIata,
    defaultOriginByCountry: countryOrigins,
    candidatesByCountry,
    expiresAt: now + AIRPORTS_CACHE_TTL_MS
  };

  return airportsCache;
}

async function loadCitiesByIata() {
  const now = Date.now();
  if (citiesCache.byIata.size && citiesCache.expiresAt > now) {
    return citiesCache.byIata;
  }

  const res = await fetch(CITIES_DATA_URL, {
    headers: { accept: "application/json" }
  });
  if (!res.ok) throw new Error(`cities fetch failed (${res.status})`);
  const raw = await res.json();
  const list = Array.isArray(raw) ? raw : [];
  const byIata = new Map();
  for (const item of list) {
    const iata = String(item?.code || item?.iata || "")
      .trim()
      .toUpperCase();
    const countryCode = String(item?.country_code || item?.countryCode || "")
      .trim()
      .toUpperCase();
    if (!iata || !countryCode) continue;
    byIata.set(iata, {
      countryCode,
      cityName: String(item?.name || item?.city || item?.city_name || "").trim(),
      lat:
        parseNumber(item?.coordinates?.lat) ??
        parseNumber(item?.latitude) ??
        parseNumber(item?.lat) ??
        parseNumber(String(item?.coordinates || "").split(",")[0]),
      lng:
        parseNumber(item?.coordinates?.lon) ??
        parseNumber(item?.longitude) ??
        parseNumber(item?.lon) ??
        parseNumber(item?.lng) ??
        parseNumber(String(item?.coordinates || "").split(",")[1])
    });
  }

  citiesCache = {
    byIata,
    expiresAt: now + AIRPORTS_CACHE_TTL_MS
  };
  return byIata;
}

async function loadAirlines() {
  const now = Date.now();
  if (airlinesCache.list.length && airlinesCache.expiresAt > now) {
    return airlinesCache.list;
  }

  const res = await fetch(AIRLINES_DATA_URL, {
    headers: { accept: "application/json" }
  });
  if (!res.ok) throw new Error(`airlines fetch failed (${res.status})`);
  const raw = await res.json();
  const list = Array.isArray(raw) ? raw : [];
  const out = list
    .map((item) => ({
      iata: String(item?.iata || "").trim().toUpperCase(),
      icao: String(item?.icao || "").trim().toUpperCase(),
      name: String(item?.name || "").trim(),
      countryCode: String(item?.country_code || "").trim().toUpperCase(),
      countryName: String(item?.country || "").trim()
    }))
    .filter((row) => row.name);

  airlinesCache = {
    list: out,
    expiresAt: now + AIRPORTS_CACHE_TTL_MS
  };
  return out;
}

function slugifyCountryName(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function scoreMatch(queryNormalized, ...candidates) {
  let best = 0;
  for (const candidate of candidates) {
    const normalized = normalizeText(candidate);
    if (!normalized) continue;
    if (normalized === queryNormalized) return 100;
    if (normalized.startsWith(queryNormalized)) best = Math.max(best, 80);
    else if (normalized.includes(queryNormalized)) best = Math.max(best, 60);
  }
  return best;
}

function displayRegionName(countryCode) {
  const code = String(countryCode || "")
    .trim()
    .toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return code || "";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code;
  } catch {
    return code;
  }
}

async function resolveCityDirections({ originCountry, originIata, currency }) {
  const airportData = await loadAirportsByIata();
  const candidates = [];
  if (/^[A-Z]{3}$/.test(originIata)) candidates.push(originIata);
  const countryCandidates = Array.from(airportData.candidatesByCountry.get(originCountry) || []);
  for (const c of countryCandidates) {
    if (!/^[A-Z]{3}$/.test(c)) continue;
    if (!candidates.includes(c)) candidates.push(c);
  }
  if (!candidates.length) {
    throw new Error("No origin IATA available for the provided country code");
  }
  const headers = buildTpHeaders();
  let tpRes = null;
  let tpPayload = null;
  let resolvedOrigin = "";
  let upstreamBody = "";
  for (const candidate of candidates) {
    const tpUrl = new URL(CITY_DIRECTIONS_URL);
    tpUrl.searchParams.set("origin", candidate);
    tpUrl.searchParams.set("currency", currency);
    const response = await fetch(tpUrl.toString(), { headers });
    if (response.ok) {
      let parsed = null;
      try {
        parsed = await response.json();
      } catch {
        parsed = null;
      }
      const entries = Object.values(parsed?.data || {});
      if (entries.length > 0) {
        resolvedOrigin = candidate;
        tpRes = response;
        tpPayload = parsed;
        break;
      }
      continue;
    }
    let body = "";
    try {
      body = await response.text();
    } catch {
      body = "";
    }
    const isNonFlightable = response.status === 400 && /not flightable/i.test(body);
    if (!isNonFlightable) {
      resolvedOrigin = candidate;
      tpRes = response;
      upstreamBody = body;
      break;
    }
  }
  return { airportData, tpRes, tpPayload, resolvedOrigin, upstreamBody };
}

export async function searchFlights(req, res) {
  const parsed = flightSearchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).send(parsed.error.issues.map((i) => i.message).join(", "));
  }
  const payload = parsed.data;
  const currency = String(req.query.currency || "USD")
    .trim()
    .toUpperCase();
  try {
    const airportData = await loadAirportsByIata();
    const cityData = await loadCitiesByIata();
    const originIata = resolveIataByCityName(payload.from, airportData, cityData);
    const destinationIata = resolveIataByCityName(payload.to, airportData, cityData);
    if (!originIata || !destinationIata) {
      return res.status(400).json({
        error: "Unable to resolve route IATA codes",
        from: payload.from,
        to: payload.to
      });
    }

    const headers = buildTpHeaders();
    const url = new URL(PRICES_LATEST_URL);
    url.searchParams.set("origin", originIata);
    url.searchParams.set("destination", destinationIata);
    url.searchParams.set("currency", currency.toLowerCase());
    url.searchParams.set("period_type", "year");
    url.searchParams.set("page", "1");
    url.searchParams.set("limit", "50");
    url.searchParams.set("sorting", "price");
    url.searchParams.set("trip_class", payload.cabin === "economy" ? "0" : "1");
    url.searchParams.set("one_way", payload.returnDate ? "false" : "true");

    const tpRes = await fetch(url.toString(), { headers });
    if (!tpRes.ok) {
      const body = await tpRes.text().catch(() => "");
      return res.status(502).json({
        error: "Travelpayouts route search failed",
        status: tpRes.status,
        upstreamBody: body || null
      });
    }

    const tpPayload = await tpRes.json();
    const rows = Array.isArray(tpPayload?.data) ? tpPayload.data : [];
    const offers = rows
      .map((row, idx) => {
        const amount = Number(row?.value ?? row?.price);
        if (!Number.isFinite(amount) || amount <= 0) return null;
        const departAtRaw = String(row?.depart_date || row?.departure_at || payload.departDate || "").trim();
        const departAt = departAtRaw
          ? departAtRaw.length === 10
            ? `${departAtRaw}T09:00:00.000Z`
            : new Date(departAtRaw).toISOString()
          : new Date().toISOString();
        const durationMinutes = Math.max(
          45,
          Number(row?.flight_duration) || Number(row?.duration) || Number(row?.trip_duration) || 180
        );
        const arriveAt = new Date(new Date(departAt).getTime() + durationMinutes * 60 * 1000).toISOString();
        const stops = Math.max(0, Number(row?.transfers) || Number(row?.number_of_changes) || 0);
        const carrier = String(row?.airline || "TP")
          .trim()
          .toUpperCase();
        return {
          id: `real_${originIata}_${destinationIata}_${idx}`,
          price: {
            amount: Math.round(amount),
            currency: String(tpPayload?.currency || currency).toUpperCase()
          },
          segments: [
            {
              from: originIata,
              to: destinationIata,
              departAt,
              arriveAt,
              carrier,
              flightNumber: `${carrier}${100 + idx}`,
              durationMinutes,
              stops
            }
          ],
          deepLink: "https://www.aviasales.com/"
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.price.amount - b.price.amount)
      .slice(0, 30);

    return res.json({ offers });
  } catch (err) {
    return res.status(502).json({
      error: "Failed to load real route offers",
      detail: err instanceof Error ? err.message : "unknown_error"
    });
  }
}

export async function searchLocations(req, res) {
  const query = String(req.query.query || "")
    .trim();
  const normalizedQuery = normalizeText(query);
  const limit = Math.min(Math.max(Number(req.query.limit || 12), 3), 30);
  if (normalizedQuery.length < 2) {
    return res.json({ query, locations: [] });
  }

  try {
    const airportData = await loadAirportsByIata();
    const cityData = await loadCitiesByIata();
    const airlines = await loadAirlines();
    const locations = [];
    const countries = new Map();
    const matchedCountryCodes = new Set();
    const typePriority = {
      country: 0,
      city: 1,
      airport: 2,
      airline: 3
    };

    for (const city of cityData.values()) {
      const countryCode = String(city?.countryCode || "").trim().toUpperCase();
      if (!/^[A-Z]{2}$/.test(countryCode)) continue;
      let bucket = countries.get(countryCode);
      if (!bucket) {
        bucket = {
          countryCode,
          countryName: displayRegionName(countryCode),
          cityCount: 0
        };
        countries.set(countryCode, bucket);
      }
      bucket.cityCount += 1;
    }

    for (const country of countries.values()) {
      const score = scoreMatch(normalizedQuery, country.countryName, country.countryCode);
      if (!score) continue;
      matchedCountryCodes.add(country.countryCode);
      locations.push({
        id: `country:${country.countryCode}`,
        type: "country",
        name: country.countryName,
        iata: country.countryCode,
        countryCode: country.countryCode,
        countryName: country.countryName,
        cityCount: country.cityCount,
        relatedCountry: true,
        score: score + 10
      });
    }

    for (const [iata, city] of cityData.entries()) {
      const cityName = String(city?.cityName || "").trim();
      const countryCode = String(city?.countryCode || "").trim().toUpperCase();
      const countryName = displayRegionName(countryCode);
      const baseScore = scoreMatch(normalizedQuery, cityName, iata, countryName);
      const countryBoost = matchedCountryCodes.has(countryCode) ? 30 : 0;
      const score = baseScore + countryBoost;
      if (!score) continue;
      locations.push({
        id: `city:${iata}`,
        type: "city",
        name: cityName || iata,
        iata,
        countryCode,
        countryName,
        relatedCountry: matchedCountryCodes.has(countryCode),
        score
      });
    }

    for (const [iata, airport] of airportData.byIata.entries()) {
      const airportName = String(airport?.cityName || "").trim();
      const cityCode = String(airport?.cityCode || "").trim().toUpperCase();
      const cityName = cityCode ? String(cityData.get(cityCode)?.cityName || "").trim() : "";
      const countryCode = String(airport?.countryCode || "").trim().toUpperCase();
      const countryName = displayRegionName(countryCode);
      const baseScore = scoreMatch(normalizedQuery, airportName, cityName, iata, countryName);
      const countryBoost = matchedCountryCodes.has(countryCode) ? 20 : 0;
      const score = baseScore + countryBoost;
      if (!score) continue;
      locations.push({
        id: `airport:${iata}`,
        type: "airport",
        name: airportName || iata,
        iata,
        cityIata: cityCode,
        cityName,
        countryCode,
        countryName,
        relatedCountry: matchedCountryCodes.has(countryCode),
        score
      });
    }

    for (const airline of airlines) {
      const countryName = airline.countryName || displayRegionName(airline.countryCode);
      const baseScore = scoreMatch(normalizedQuery, airline.name, airline.iata, airline.icao, countryName);
      const countryBoost = matchedCountryCodes.has(airline.countryCode) ? 15 : 0;
      const score = baseScore + countryBoost;
      if (!score) continue;
      locations.push({
        id: `airline:${airline.iata || airline.icao || airline.name}`,
        type: "airline",
        name: airline.name,
        iata: airline.iata || airline.icao || "--",
        countryCode: airline.countryCode,
        countryName,
        relatedCountry: matchedCountryCodes.has(airline.countryCode),
        score
      });
    }

    const deduped = [];
    const seen = new Set();
    const effectiveLimit = matchedCountryCodes.size > 0 ? Math.max(limit, 120) : limit;
    const sorted = [...locations].sort((a, b) => {
      const aRelated = Boolean(a.relatedCountry);
      const bRelated = Boolean(b.relatedCountry);
      if (aRelated !== bRelated) return aRelated ? -1 : 1;
      const aTypeRank = typePriority[a.type] ?? 99;
      const bTypeRank = typePriority[b.type] ?? 99;
      if (aTypeRank !== bTypeRank) return aTypeRank - bTypeRank;
      if (b.score !== a.score) return b.score - a.score;
      return String(a.name || "").localeCompare(String(b.name || ""));
    });
    for (const row of sorted) {
      if (seen.has(row.id)) continue;
      seen.add(row.id);
      const { score, relatedCountry, ...item } = row;
      deduped.push(item);
      if (deduped.length >= effectiveLimit) break;
    }

    return res.json({ query, locations: deduped });
  } catch (err) {
    return res.status(502).json({
      error: "Failed to search locations",
      detail: err instanceof Error ? err.message : "unknown_error"
    });
  }
}

function resolveDestinationPlace(destinationIata, airportData, cityData) {
  const code = String(destinationIata || "")
    .trim()
    .toUpperCase();
  if (!code) return null;
  const airport = airportData.byIata.get(code);
  const directCity = cityData.get(code);
  const airportCity = airport?.cityCode ? cityData.get(airport.cityCode) : null;
  const place = directCity || airportCity || airport;
  if (!place) return null;
  return {
    countryCode: String(place.countryCode || "").trim().toUpperCase(),
    cityName: String(directCity?.cityName || airportCity?.cityName || airport?.cityName || code).trim() || code
  };
}

function addPopularDestinationCandidate(map, { countryCode, originCountry, price, destinationIata, destinationCity, source }) {
  const destCountry = String(countryCode || "").trim().toUpperCase();
  const amount = Number(price);
  if (!/^[A-Z]{2}$/.test(destCountry) || destCountry === originCountry) return;
  if (!Number.isFinite(amount) || amount <= 0) return;

  const prev = map.get(destCountry);
  if (!prev) {
    map.set(destCountry, {
      countryCode: destCountry,
      fromPrice: Math.round(amount),
      destinationIata,
      destinationCity,
      popularity: 1,
      sources: new Set([source])
    });
    return;
  }

  prev.popularity = (prev.popularity || 0) + 1;
  prev.sources.add(source);
  if (amount < prev.fromPrice) {
    prev.fromPrice = Math.round(amount);
    prev.destinationIata = destinationIata;
    prev.destinationCity = destinationCity;
  }
}

async function mergePopularDestinationsFromPricesLatest({
  map,
  origin,
  originCountry,
  currency,
  airportData,
  cityData,
  headers
}) {
  if (!/^[A-Z]{3}$/.test(origin)) return;

  for (let page = 1; page <= 3; page += 1) {
    const url = new URL(PRICES_LATEST_URL);
    url.searchParams.set("origin", origin);
    url.searchParams.set("currency", currency);
    url.searchParams.set("period_type", "year");
    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", "1000");
    url.searchParams.set("sorting", "price");
    url.searchParams.set("trip_class", "0");
    url.searchParams.set("one_way", "true");
    url.searchParams.set("show_to_affiliates", "true");

    const response = await fetch(url.toString(), { headers });
    if (!response.ok) break;
    const payload = await response.json();
    const rows = Array.isArray(payload?.data) ? payload.data : [];
    if (!rows.length) break;

    for (const row of rows) {
      const destinationIata = String(row?.destination || "")
        .trim()
        .toUpperCase();
      const place = resolveDestinationPlace(destinationIata, airportData, cityData);
      if (!place) continue;
      addPopularDestinationCandidate(map, {
        countryCode: place.countryCode,
        originCountry,
        price: row?.value ?? row?.price,
        destinationIata,
        destinationCity: place.cityName,
        source: "prices-latest"
      });
    }

    if (rows.length < 1000) break;
  }
}

export async function getPopularDestinations(req, res) {
  const originCountry = String(req.query.originCountry || "TR")
    .trim()
    .toUpperCase();
  const originIata = String(req.query.originIata || "")
    .trim()
    .toUpperCase();
  const currency = String(req.query.currency || "USD")
    .trim()
    .toLowerCase();
  if (!/^[A-Z]{2}$/.test(originCountry)) {
    return res.status(400).json({ error: "originCountry must be ISO country code, e.g. TR" });
  }
  try {
    const { airportData, tpRes, tpPayload, resolvedOrigin, upstreamBody } = await resolveCityDirections({
      originCountry,
      originIata,
      currency
    });
    const cityData = await loadCitiesByIata();
    if (!tpRes) {
      return res.status(502).json({
        error: "Travelpayouts city-directions request failed",
        originCountry,
        status: 502,
        upstreamBody: "No flightable origin IATA with route data found for this country"
      });
    }
    if (!tpRes.ok) {
      return res.status(502).json({
        error: "Travelpayouts city-directions request failed",
        originCountry,
        origin: resolvedOrigin,
        status: tpRes.status,
        upstreamBody: upstreamBody || null
      });
    }

    const payload = tpPayload || (await tpRes.json());
    const entries = Object.values(payload?.data || {});
    const destinationsByCountry = new Map();

    for (const row of entries) {
      const destinationIata = String(row?.destination || "")
        .trim()
        .toUpperCase();
      if (!destinationIata) continue;
      const place = resolveDestinationPlace(destinationIata, airportData, cityData);
      if (!place) continue;
      addPopularDestinationCandidate(destinationsByCountry, {
        countryCode: place.countryCode,
        originCountry,
        price: row?.price,
        destinationIata,
        destinationCity: place.cityName,
        source: "city-directions"
      });
    }

    await mergePopularDestinationsFromPricesLatest({
      map: destinationsByCountry,
      origin: resolvedOrigin,
      originCountry,
      currency,
      airportData,
      cityData,
      headers: buildTpHeaders()
    });

    const destinations = Array.from(destinationsByCountry.values())
      .map((item) => ({
        countryCode: item.countryCode,
        fromPrice: item.fromPrice,
        destinationIata: item.destinationIata,
        destinationCity: item.destinationCity,
        popularity: item.popularity || 0
      }))
      .sort((a, b) => b.popularity - a.popularity || a.fromPrice - b.fromPrice)
      .slice(0, 24);

    return res.json({
      originCountry,
      origin: resolvedOrigin,
      currency: String(payload?.currency || currency).toUpperCase(),
      source: "travelpayouts",
      destinations
    });
  } catch (err) {
    return res.status(502).json({
      error: "Failed to load popular destinations",
      originCountry,
      detail: err instanceof Error ? err.message : "unknown_error"
    });
  }
}

export async function getDestinationCountryData(req, res) {
  const slug = String(req.query.slug || "")
    .trim()
    .toLowerCase();
  const regionCodeHint = String(req.query.regionCode || "")
    .trim()
    .toUpperCase();
  const originCountry = String(req.query.originCountry || "TR")
    .trim()
    .toUpperCase();
  const originIata = String(req.query.originIata || "")
    .trim()
    .toUpperCase();
  const currency = String(req.query.currency || "USD")
    .trim()
    .toLowerCase();

  if (!slug) {
    return res.status(400).json({ error: "slug is required" });
  }
  if (!/^[A-Z]{2}$/.test(originCountry)) {
    return res.status(400).json({ error: "originCountry must be ISO country code, e.g. TR" });
  }

  try {
    const effectiveOrigin = /^[A-Z]{3}$/.test(originIata)
      ? originIata
      : ((await resolveCityDirections({ originCountry, originIata: "", currency })).resolvedOrigin || "");
    const mapDataRes = await getMapDataCore({
      origin: effectiveOrigin,
      currency,
      limit: 1000,
      maxPages: 10
    });
    const selected =
      (regionCodeHint &&
        mapDataRes.countries.find((c) => String(c.regionCode || "").toLowerCase() === regionCodeHint.toLowerCase())) ||
      mapDataRes.countries.find((c) => slugifyCountryName(c.country) === slug || c.regionCode === slug);
    if (!selected) {
      return res.status(404).json({ error: "Destination country not found", slug });
    }

    const detailedTickets = [];
    const headers = buildTpHeaders();
    const effectiveCurrency = String(mapDataRes.currency || currency)
      .trim()
      .toLowerCase();
    const seenTicketKeys = new Set();
    const normalizedOrigin = String(mapDataRes.origin || "")
      .trim()
      .toUpperCase();
    if (/^[A-Z]{3}$/.test(normalizedOrigin)) {
      for (const city of selected.cities) {
        const destinationIata = String(city?.destinationIata || "")
          .trim()
          .toUpperCase();
        if (!/^[A-Z]{3}$/.test(destinationIata)) continue;

        const calendarUrl = new URL(PRICES_CALENDAR_URL);
        calendarUrl.searchParams.set("origin", normalizedOrigin);
        calendarUrl.searchParams.set("destination", destinationIata);
        calendarUrl.searchParams.set("currency", effectiveCurrency);
        calendarUrl.searchParams.set("one_way", "true");

        const calendarRes = await fetch(calendarUrl.toString(), { headers });
        if (!calendarRes.ok) continue;
        const calendarPayload = await calendarRes.json();
        const calendarRows = Object.values(calendarPayload?.data || {});
        for (const row of calendarRows) {
          const price = Number(row?.price);
          if (!Number.isFinite(price) || price <= 0) continue;
          const dateText = String(row?.depart_date || row?.departure_at || "").trim();
          const parsedDate = dateText ? new Date(dateText) : null;
          const dateLabel =
            parsedDate && !Number.isNaN(parsedDate.getTime())
              ? parsedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
              : "Best fare";
          const dedupeKey = `${destinationIata}|${Math.round(price)}|${dateText}`;
          if (seenTicketKeys.has(dedupeKey)) continue;
          seenTicketKeys.add(dedupeKey);

          detailedTickets.push({
            id: `${destinationIata}-${detailedTickets.length}`,
            price: Math.round(price),
            currencyCode: String(effectiveCurrency || mapDataRes.currency || "USD").toUpperCase(),
            toCity: city.name,
            destinationIata,
            dateLabel,
            timeRange: "Travelpayouts",
            durationMeta: city.isDirect ? "Direct" : "Cheapest",
            layoverText: city.hasBaggage ? "Baggage included" : undefined
          });
        }
      }
    }

    const tickets = detailedTickets
      .sort((a, b) => a.price - b.price)
      .slice(0, 400);

    return res.json({
      slug: slugifyCountryName(selected.country),
      regionCode: String(selected.regionCode || "").toLowerCase(),
      country: selected.country,
      origin: mapDataRes.origin,
      currency: mapDataRes.currency,
      cities: [...selected.cities].sort((a, b) => a.fromPrice - b.fromPrice),
      tickets:
        tickets.length > 0
          ? tickets
          : selected.cities
              .map((city, idx) => ({
                id: `${city.destinationIata || city.name}-${idx}`,
                price: Math.round(Number(city.fromPrice) || 0),
                currencyCode: String(mapDataRes.currency || "USD").toUpperCase(),
                toCity: city.name,
                destinationIata: city.destinationIata,
                dateLabel: "Best fare",
                timeRange: "Travelpayouts",
                durationMeta: city.isDirect ? "Direct" : "Cheapest",
                layoverText: city.hasBaggage ? "Baggage included" : undefined
              }))
              .filter((t) => Number.isFinite(t.price) && t.price > 0)
              .sort((a, b) => a.price - b.price)
    });
  } catch (err) {
    return res.status(502).json({
      error: "Failed to load destination country",
      slug,
      detail: err instanceof Error ? err.message : "unknown_error"
    });
  }
}

async function getMapDataCore({ origin, currency, limit, maxPages }) {
  const airportData = await loadAirportsByIata();
  const cityData = await loadCitiesByIata();
  const headers = buildTpHeaders();
  const queryAttempts = [];
  queryAttempts.push({ currency, showToAffiliates: true });
  queryAttempts.push({ currency, showToAffiliates: false });
  if (currency !== "usd") {
    queryAttempts.push({ currency: "usd", showToAffiliates: true });
    queryAttempts.push({ currency: "usd", showToAffiliates: false });
  }

  let countries = new Map();
  let usedQuery = null;
  for (const attempt of queryAttempts) {
    countries = new Map();
    for (let page = 1; page <= maxPages; page += 1) {
      const url = new URL(PRICES_LATEST_URL);
      url.searchParams.set("currency", attempt.currency);
      url.searchParams.set("period_type", "year");
      url.searchParams.set("page", String(page));
      url.searchParams.set("limit", String(limit));
      url.searchParams.set("show_to_affiliates", attempt.showToAffiliates ? "true" : "false");
      url.searchParams.set("sorting", "price");
      url.searchParams.set("trip_class", "0");
      url.searchParams.set("one_way", "true");
      if (/^[A-Z]{3}$/.test(origin)) {
        url.searchParams.set("origin", origin);
      }

      const tpRes = await fetch(url.toString(), { headers });
      if (!tpRes.ok) {
        let body = "";
        try {
          body = await tpRes.text();
        } catch {
          body = "";
        }
        throw new Error(`Travelpayouts prices-latest request failed (${tpRes.status}) ${body}`);
      }

      const payload = await tpRes.json();
      const rows = Array.isArray(payload?.data) ? payload.data : [];
      if (!rows.length) break;

      for (const row of rows) {
        const destinationIata = String(row?.destination || "")
          .trim()
          .toUpperCase();
        if (!destinationIata) continue;
        const airportPlace = airportData.byIata.get(destinationIata);
        const cityPlaceDirect = cityData.get(destinationIata);
        const cityPlaceFromAirport = airportPlace?.cityCode ? cityData.get(airportPlace.cityCode) : null;
        const place = airportPlace || cityPlaceDirect;
        if (!place) continue;
        if (!Number.isFinite(place.lat) || !Number.isFinite(place.lng)) continue;
        const countryCode = String(place.countryCode || "")
          .trim()
          .toUpperCase();
        if (!countryCode) continue;
        const price = Number(row?.value ?? row?.price);
        if (!Number.isFinite(price) || price <= 0) continue;
        const transferCount =
          parseNumber(row?.transfers) ??
          parseNumber(row?.number_of_changes) ??
          parseNumber(row?.stops) ??
          parseNumber(row?.stopovers);
        const isDirectRow = Boolean(row?.is_direct || row?.direct) || transferCount === 0;
        const hasBaggageRow =
          parseBooleanLike(row?.has_baggage) ||
          parseBooleanLike(row?.baggage_included) ||
          parseBooleanLike(row?.with_baggage) ||
          parseBooleanLike(row?.baggage);
        const cityKey = String(cityPlaceDirect ? destinationIata : airportPlace?.cityCode || destinationIata)
          .trim()
          .toUpperCase();
        if (!cityKey) continue;

        let group = countries.get(countryCode);
        if (!group) {
          let countryName = countryCode;
          try {
            countryName = new Intl.DisplayNames(["en"], { type: "region" }).of(countryCode) || countryCode;
          } catch {
            countryName = countryCode;
          }
          group = {
            country: countryName,
            regionCode: countryCode.toLowerCase(),
            cities: new Map()
          };
          countries.set(countryCode, group);
        }

        const prev = group.cities.get(cityKey);
        if (!prev || price < prev.fromPrice) {
          group.cities.set(cityKey, {
            name: cityPlaceDirect?.cityName || cityPlaceFromAirport?.cityName || place.cityName || destinationIata,
            destinationIata: cityKey,
            fromPrice: Math.round(price),
            popularity: (prev?.popularity || 0) + 1,
            isDirect: Boolean(prev?.isDirect) || isDirectRow,
            hasBaggage: Boolean(prev?.hasBaggage) || hasBaggageRow,
            lat: place.lat,
            lng: place.lng,
            image: `https://img.avs.io/explore/cities/${cityKey}`
          });
        } else {
          group.cities.set(cityKey, {
            ...prev,
            popularity: (prev.popularity || 0) + 1,
            isDirect: Boolean(prev.isDirect) || isDirectRow,
            hasBaggage: Boolean(prev.hasBaggage) || hasBaggageRow
          });
        }
      }

      if (rows.length < limit) break;
    }
    if (countries.size > 0) {
      usedQuery = attempt;
      break;
    }
  }

  if (/^[A-Z]{3}$/.test(origin)) {
    try {
      const cityDirectionsUrl = new URL(CITY_DIRECTIONS_URL);
      cityDirectionsUrl.searchParams.set("origin", origin);
      cityDirectionsUrl.searchParams.set("currency", String(usedQuery?.currency || currency));
      const cityDirectionsRes = await fetch(cityDirectionsUrl.toString(), { headers });
      if (cityDirectionsRes.ok) {
        const cityDirectionsPayload = await cityDirectionsRes.json();
        const routeRows = Object.values(cityDirectionsPayload?.data || {});
        for (const row of routeRows) {
          const destinationIata = String(row?.destination || "")
            .trim()
            .toUpperCase();
          if (!destinationIata) continue;
          const price = Number(row?.price);
          if (!Number.isFinite(price) || price <= 0) continue;

          const airportPlace = airportData.byIata.get(destinationIata);
          const cityPlaceDirect = cityData.get(destinationIata);
          const cityPlaceFromAirport = airportPlace?.cityCode ? cityData.get(airportPlace.cityCode) : null;
          const place = airportPlace || cityPlaceDirect;
          if (!place) continue;
          if (!Number.isFinite(place.lat) || !Number.isFinite(place.lng)) continue;

          const countryCode = String(place.countryCode || "")
            .trim()
            .toUpperCase();
          if (!countryCode) continue;
          const cityKey = String(cityPlaceDirect ? destinationIata : airportPlace?.cityCode || destinationIata)
            .trim()
            .toUpperCase();
          if (!cityKey) continue;

          let group = countries.get(countryCode);
          if (!group) {
            let countryName = countryCode;
            try {
              countryName = new Intl.DisplayNames(["en"], { type: "region" }).of(countryCode) || countryCode;
            } catch {
              countryName = countryCode;
            }
            group = {
              country: countryName,
              regionCode: countryCode.toLowerCase(),
              cities: new Map()
            };
            countries.set(countryCode, group);
          }

          const prev = group.cities.get(cityKey);
          if (!prev || price < prev.fromPrice) {
            group.cities.set(cityKey, {
              name: cityPlaceDirect?.cityName || cityPlaceFromAirport?.cityName || place.cityName || destinationIata,
              destinationIata: cityKey,
              fromPrice: Math.round(price),
              popularity: (prev?.popularity || 0) + 1,
              isDirect: true,
              hasBaggage: Boolean(prev?.hasBaggage),
              lat: place.lat,
              lng: place.lng,
              image: `https://img.avs.io/explore/cities/${cityKey}`
            });
          }
        }
      }
    } catch {
      // Keep map-data response from prices/latest when city-directions merge fails.
    }
  }

  const out = Array.from(countries.values())
    .map((group) => ({
      country: group.country,
      regionCode: group.regionCode,
      cities: Array.from(group.cities.values()).sort((a, b) => a.fromPrice - b.fromPrice)
    }))
    .filter((g) => g.cities.length > 0)
    .sort((a, b) => a.country.localeCompare(b.country));

  return {
    source: "travelpayouts",
    origin: /^[A-Z]{3}$/.test(origin) ? origin : null,
    currency: (usedQuery?.currency || currency).toUpperCase(),
    countries: out,
    query: usedQuery || { currency, showToAffiliates: true }
  };
}

export async function getMapData(req, res) {
  const origin = String(req.query.origin || "")
    .trim()
    .toUpperCase();
  const currency = String(req.query.currency || "USD")
    .trim()
    .toLowerCase();
  const limit = Math.min(Math.max(Number(req.query.limit || 1000), 200), 1000);
  const maxPages = Math.min(Math.max(Number(req.query.maxPages || 5), 1), 10);

  try {
    const result = await getMapDataCore({ origin, currency, limit, maxPages });
    return res.json(result);
  } catch (err) {
    return res.status(502).json({
      error: "Failed to load map data",
      detail: err instanceof Error ? err.message : "unknown_error"
    });
  }
}
