/**
 * Single source of mock destination data for home (Popular), /map, and /destinations/[slug].
 * Edit this file only to change countries, cities, prices, or coordinates across the site.
 */

export type SiteCity = {
  name: string;
  fromPrice: number;
  lat: number;
  lng: number;
  /** Hero image for this city (see `public/Images`) */
  image: string;
};

export type SiteDestinationCountry = {
  slug: string;
  country: string;
  regionCode: string;
  image: string;
  /** If set, used on the popular card; otherwise min city `fromPrice` */
  popularFromPrice?: number;
  cities: SiteCity[];
};

/** Canonical list (order = carousel on home and default order on map). Türkiye first — primary market. */
export const SITE_DESTINATION_COUNTRIES: SiteDestinationCountry[] = [
  {
    slug: "tr",
    country: "Türkiye",
    regionCode: "tr",
    image: "/Images/turkiye.avif",
    cities: [
      { name: "Antalya", fromPrice: 402, lat: 36.8969, lng: 30.7133, image: "/Images/tr-antalya.avif" },
      { name: "Ankara", fromPrice: 355, lat: 39.9334, lng: 32.8597, image: "/Images/tr-ankara.avif" },
      { name: "Izmir", fromPrice: 368, lat: 38.4237, lng: 27.1428, image: "/Images/tr-izmir.avif" }
    ]
  },
  {
    slug: "us",
    country: "United States",
    regionCode: "us",
    image: "/Images/usa.avif",
    cities: [
      { name: "New York", fromPrice: 193, lat: 40.7128, lng: -74.006, image: "/Images/us-new-york.avif" },
      { name: "Los Angeles", fromPrice: 230, lat: 34.0522, lng: -118.2437, image: "/Images/us-los-angeles.avif" },
      { name: "Miami", fromPrice: 256, lat: 25.7617, lng: -80.1918, image: "/Images/us-miami.avif" },
      { name: "Chicago", fromPrice: 241, lat: 41.8781, lng: -87.6298, image: "/Images/us-chicago.avif" }
    ]
  },
  {
    slug: "ru",
    country: "Russia",
    regionCode: "ru",
    image: "/Images/russia.avif",
    cities: [
      { name: "Moscow", fromPrice: 391, lat: 55.7558, lng: 37.6173, image: "/Images/ru-moscow.avif" },
      { name: "Saint Petersburg", fromPrice: 430, lat: 59.9311, lng: 30.3609, image: "/Images/ru-saint-petersburg.avif" },
      { name: "Adler/Sochi", fromPrice: 499, lat: 43.4333, lng: 39.9236, image: "/Images/ru-adler.avif" },
      { name: "Krasnodar", fromPrice: 528, lat: 45.0355, lng: 38.9753, image: "/Images/ru-krasnodar.avif" },
      { name: "Kazan", fromPrice: 494, lat: 55.7961, lng: 49.1064, image: "/Images/ru-kazan.avif" },
      { name: "Sochi", fromPrice: 468, lat: 43.6028, lng: 39.7342, image: "/Images/ru-sochi.avif" }
    ]
  },
  {
    slug: "in",
    country: "India",
    regionCode: "in",
    image: "/Images/india.avif",
    cities: [
      { name: "Delhi", fromPrice: 248, lat: 28.6139, lng: 77.209, image: "/Images/in-delhi.avif" },
      { name: "Mumbai", fromPrice: 302, lat: 19.076, lng: 72.8777, image: "/Images/in-mumbai.avif" },
      { name: "Bengaluru", fromPrice: 277, lat: 12.9716, lng: 77.5946, image: "/Images/in-bengaluru.avif" },
      { name: "Goa", fromPrice: 319, lat: 15.2993, lng: 74.124, image: "/Images/in-goa.avif" },
      { name: "Hyderabad", fromPrice: 289, lat: 17.385, lng: 78.4867, image: "/Images/in-hyderabad.avif" },
      { name: "Chennai", fromPrice: 271, lat: 13.0827, lng: 80.2707, image: "/Images/in-chennai.avif" },
      { name: "Kolkata", fromPrice: 263, lat: 22.5726, lng: 88.3639, image: "/Images/in-kolkata.avif" }
    ]
  },
  {
    slug: "es",
    country: "Spain",
    regionCode: "es",
    image: "/Images/spain.avif",
    cities: [
      { name: "Madrid", fromPrice: 393, lat: 40.4168, lng: -3.7038, image: "/Images/es-madrid.avif" },
      { name: "Barcelona", fromPrice: 361, lat: 41.3851, lng: 2.1734, image: "/Images/es-barcelona.avif" },
      { name: "Valencia", fromPrice: 378, lat: 39.4699, lng: -0.3763, image: "/Images/es-valencia.avif" }
    ]
  },
  {
    slug: "uz",
    country: "Uzbekistan",
    regionCode: "uz",
    image: "/Images/uzbekistan.avif",
    cities: [
      { name: "Tashkent", fromPrice: 213, lat: 41.2995, lng: 69.2401, image: "/Images/uz-tashkent.avif" },
      { name: "Samarkand", fromPrice: 235, lat: 39.6542, lng: 66.9597, image: "/Images/uz-samarkand.avif" },
      { name: "Bukhara", fromPrice: 241, lat: 39.767, lng: 64.4235, image: "/Images/uz-bukhara.avif" }
    ]
  }
];

function minCityPrice(cities: SiteCity[]): number {
  return Math.min(...cities.map((c) => c.fromPrice));
}

/** Home — Popular destinations carousel */
export type PopularDestinationCard = {
  slug: string;
  country: string;
  fromPrice: number;
  image: string;
};

export function getPopularDestinationCards(): PopularDestinationCard[] {
  return SITE_DESTINATION_COUNTRIES.map((d) => ({
    slug: d.slug,
    country: d.country,
    fromPrice: d.popularFromPrice ?? minCityPrice(d.cities),
    image: d.image
  }));
}

/** /map — Leaflet + country sections */
export type MapCountryGroup = {
  country: string;
  regionCode: string;
  cities: SiteCity[];
};

export function getMapCountryGroups(): MapCountryGroup[] {
  return SITE_DESTINATION_COUNTRIES.map((d) => ({
    country: d.country,
    regionCode: d.regionCode,
    cities: d.cities
  }));
}

/** /destinations/[slug] */
export type DestinationCityLite = { name: string; fromPrice: number; image: string };

export type DestinationTicket = {
  id: string;
  price: number;
  toCity: string;
  dateLabel: string;
  timeRange: string;
  durationMeta: string;
  layoverText?: string;
};

export type PopularDestinationPageData = {
  slug: string;
  country: string;
  regionCode: string;
  image: string;
  minFromPrice: number;
  cities: DestinationCityLite[];
  tickets: DestinationTicket[];
};

const TICKETS_PER_CITY = 5;

type TicketTemplate = Pick<DestinationTicket, "dateLabel" | "timeRange" | "durationMeta" | "layoverText">;

/** Five distinct mock itineraries per city (rotated if TICKETS_PER_CITY increases). */
const TICKET_VARIANTS: TicketTemplate[] = [
  { dateLabel: "Mon, May 11", timeRange: "7:30pm — 8:55am", durationMeta: "41h / 2 layovers", layoverText: "Seoul · Guangzhou" },
  { dateLabel: "Tue, May 12", timeRange: "9:15am — 6:20pm", durationMeta: "22h / 1 layover", layoverText: "Taipei" },
  { dateLabel: "Wed, May 13", timeRange: "11:30pm — 4:15pm+", durationMeta: "33h / 2 layovers", layoverText: "Seoul · Dubai" },
  { dateLabel: "Thu, May 14", timeRange: "6:05am — 11:10pm", durationMeta: "19h / direct", layoverText: undefined },
  { dateLabel: "Fri, May 15", timeRange: "2:40pm — 9:50am+", durationMeta: "28h / 2 layovers", layoverText: "Bangkok · Doha" }
];

function cityKeyForId(name: string): string {
  return name.replace(/\s+/g, "-").replace(/[^\w-]+/g, "").toLowerCase();
}

function baseTickets(cities: DestinationCityLite[], prefix: string): DestinationTicket[] {
  const out: DestinationTicket[] = [];
  for (const city of cities) {
    const key = cityKeyForId(city.name);
    for (let v = 0; v < TICKETS_PER_CITY; v++) {
      const t = TICKET_VARIANTS[v % TICKET_VARIANTS.length]!;
      const price = city.fromPrice + v * 16 + (city.fromPrice % 9);
      out.push({
        id: `${prefix}-${key}-${v}`,
        toCity: city.name,
        price,
        dateLabel: t.dateLabel,
        timeRange: t.timeRange,
        durationMeta: t.durationMeta,
        layoverText: t.layoverText
      });
    }
  }
  return out;
}

function countryToPageData(d: SiteDestinationCountry): PopularDestinationPageData {
  const citiesLite: DestinationCityLite[] = d.cities.map(({ name, fromPrice, image }) => ({ name, fromPrice, image }));
  const minFrom = d.popularFromPrice ?? minCityPrice(d.cities);
  return {
    slug: d.slug,
    country: d.country,
    regionCode: d.regionCode,
    image: d.image,
    minFromPrice: minFrom,
    cities: citiesLite,
    tickets: baseTickets(citiesLite, d.slug)
  };
}

const PAGE_DATA_CACHE: PopularDestinationPageData[] = SITE_DESTINATION_COUNTRIES.map(countryToPageData);

export function getDestinationPageList(): PopularDestinationPageData[] {
  return PAGE_DATA_CACHE;
}

export function getDestinationBySlug(slug: string): PopularDestinationPageData | undefined {
  return PAGE_DATA_CACHE.find((p) => p.slug === slug);
}

export function isValidDestinationSlug(slug: string): boolean {
  return PAGE_DATA_CACHE.some((p) => p.slug === slug);
}
