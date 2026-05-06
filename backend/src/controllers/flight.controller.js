import { buildMockOffers } from "../services/flightMock.service.js";
import { flightSearchSchema } from "../validators/flight.validator.js";

const AIRPORTS_DATA_URL = "https://api.travelpayouts.com/data/en/airports.json";
const CITIES_DATA_URL = "https://api.travelpayouts.com/data/en/cities.json";
const CITY_DIRECTIONS_URL = "https://api.travelpayouts.com/v1/city-directions";
const PRICES_LATEST_URL = "https://api.travelpayouts.com/v2/prices/latest";
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

function slugifyCountryName(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

  const offers = buildMockOffers(parsed.data);
  res.json({ offers });
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
    const minPriceByCountry = new Map();

    for (const row of entries) {
      const destinationIata = String(row?.destination || "")
        .trim()
        .toUpperCase();
      if (!destinationIata) continue;
      const airport = airportData.byIata.get(destinationIata);
      const destCountry = String(airport?.countryCode || "").toUpperCase();
      if (!destCountry || destCountry === originCountry) continue;
      const price = Number(row?.price);
      if (!Number.isFinite(price) || price <= 0) continue;
      const prev = minPriceByCountry.get(destCountry);
      if (!prev || price < prev.price) {
        minPriceByCountry.set(destCountry, {
          countryCode: destCountry,
          fromPrice: price,
          destinationIata,
          destinationCity: String(airport?.cityName || "").trim() || destinationIata
        });
      }
    }

    const destinations = Array.from(minPriceByCountry.values())
      .sort((a, b) => a.fromPrice - b.fromPrice)
      .slice(0, 18);

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
    const mapData = await loadCitiesByIata();
    const { airportData, tpRes, tpPayload, resolvedOrigin } = await resolveCityDirections({
      originCountry,
      originIata,
      currency
    });
    if (!tpRes || !tpRes.ok) {
      return res.status(502).json({
        error: "Travelpayouts city-directions request failed",
        originCountry
      });
    }
    const payload = tpPayload || (await tpRes.json());
    const entries = Object.values(payload?.data || {});

    const byCountry = new Map();
    for (const row of entries) {
      const destinationIata = String(row?.destination || "")
        .trim()
        .toUpperCase();
      if (!destinationIata) continue;
      const airport = airportData.byIata.get(destinationIata);
      const cityDirect = mapData.get(destinationIata);
      const cityFromAirport = airport?.cityCode ? mapData.get(airport.cityCode) : null;
      const place = airport || cityDirect;
      if (!place) continue;
      const countryCode = String(place.countryCode || "").toUpperCase();
      if (!/^[A-Z]{2}$/.test(countryCode)) continue;
      const countryName = new Intl.DisplayNames(["en"], { type: "region" }).of(countryCode) || countryCode;
      const countrySlug = slugifyCountryName(countryName);
      let bucket = byCountry.get(countryCode);
      if (!bucket) {
        bucket = {
          countryCode,
          country: countryName,
          slug: countrySlug,
          cities: new Map(),
          tickets: []
        };
        byCountry.set(countryCode, bucket);
      }

      const price = Number(row?.price);
      if (!Number.isFinite(price) || price <= 0) continue;
      const cityName = cityDirect?.cityName || cityFromAirport?.cityName || place.cityName || destinationIata;
      const cityPrev = bucket.cities.get(destinationIata);
      if (!cityPrev || price < cityPrev.fromPrice) {
        bucket.cities.set(destinationIata, {
          name: cityName,
          destinationIata,
          fromPrice: Math.round(price),
          image: `https://img.avs.io/explore/cities/${destinationIata}`
        });
      }

      const transferCount = parseNumber(row?.transfers) ?? parseNumber(row?.number_of_changes) ?? 0;
      const isDirect = transferCount === 0;
      const hasBaggage =
        parseBooleanLike(row?.has_baggage) ||
        parseBooleanLike(row?.baggage_included) ||
        parseBooleanLike(row?.with_baggage) ||
        parseBooleanLike(row?.baggage);
      const dateText = String(row?.departure_at || row?.depart_date || row?.return_date || "").trim();
      const dateObj = dateText ? new Date(dateText) : null;
      const dateLabel = dateObj && !Number.isNaN(dateObj.getTime()) ? dateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "Best fare";
      bucket.tickets.push({
        id: `${destinationIata}-${Math.round(price)}-${bucket.tickets.length}`,
        price: Math.round(price),
        toCity: cityName,
        destinationIata,
        dateLabel,
        timeRange: String(row?.airline || "").trim() || "Travelpayouts",
        durationMeta: isDirect ? "Direct" : `${transferCount || 1} stop${(transferCount || 1) > 1 ? "s" : ""}`,
        layoverText: hasBaggage ? "Baggage included" : undefined
      });
    }

    const selected =
      (regionCodeHint && byCountry.get(regionCodeHint)) ||
      Array.from(byCountry.values()).find((c) => c.slug === slug || c.countryCode.toLowerCase() === slug);
    if (!selected) {
      return res.status(404).json({ error: "Destination country not found", slug });
    }

    return res.json({
      slug: selected.slug,
      regionCode: selected.countryCode.toLowerCase(),
      country: selected.country,
      origin: resolvedOrigin,
      currency: String(payload?.currency || currency).toUpperCase(),
      cities: Array.from(selected.cities.values())
        .sort((a, b) => a.fromPrice - b.fromPrice)
        .slice(0, 60),
      tickets: selected.tickets.sort((a, b) => a.price - b.price).slice(0, 30)
    });
  } catch (err) {
    return res.status(502).json({
      error: "Failed to load destination country",
      slug,
      detail: err instanceof Error ? err.message : "unknown_error"
    });
  }
}

export async function getMapData(req, res) {
  const currency = String(req.query.currency || "USD")
    .trim()
    .toLowerCase();
  const limit = Math.min(Math.max(Number(req.query.limit || 1000), 200), 1000);
  const maxPages = Math.min(Math.max(Number(req.query.maxPages || 5), 1), 10);

  try {
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

        const tpRes = await fetch(url.toString(), { headers });
        if (!tpRes.ok) {
          let body = "";
          try {
            body = await tpRes.text();
          } catch {
            body = "";
          }
          return res.status(502).json({
            error: "Travelpayouts prices-latest request failed",
            status: tpRes.status,
            upstreamBody: body || null
          });
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
          const cityKey = destinationIata;

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
              destinationIata,
              fromPrice: Math.round(price),
              popularity: (prev?.popularity || 0) + 1,
              isDirect: Boolean(prev?.isDirect) || isDirectRow,
              hasBaggage: Boolean(prev?.hasBaggage) || hasBaggageRow,
              lat: place.lat,
              lng: place.lng,
              image: `https://img.avs.io/explore/cities/${destinationIata}`
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

    const out = Array.from(countries.values())
      .map((group) => ({
        country: group.country,
        regionCode: group.regionCode,
        cities: Array.from(group.cities.values()).sort((a, b) => a.fromPrice - b.fromPrice)
      }))
      .filter((g) => g.cities.length > 0)
      .sort((a, b) => a.country.localeCompare(b.country));

    return res.json({
      source: "travelpayouts",
      currency: (usedQuery?.currency || currency).toUpperCase(),
      countries: out,
      query: usedQuery || { currency, showToAffiliates: true }
    });
  } catch (err) {
    return res.status(502).json({
      error: "Failed to load map data",
      detail: err instanceof Error ? err.message : "unknown_error"
    });
  }
}
