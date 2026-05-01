/**
 * Primary market defaults (Türkiye-first product).
 * Use for mock “from” / “to” labels and FlightSearch initial fields.
 */
export const SITE_PRIMARY_FROM_CITY = "Istanbul";

/** Default destination in the search bar (domestic example). */
export const SITE_DEFAULT_TO_CITY = "Antalya";

/** Mock flight results route: `/search/flights?from=…&to=…` */
export function buildFlightSearchResultsHref(toCity: string, fromCity: string = SITE_PRIMARY_FROM_CITY): string {
  const q = new URLSearchParams();
  q.set("from", fromCity);
  q.set("to", toCity);
  return `/search/flights?${q.toString()}`;
}
