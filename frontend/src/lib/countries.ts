import { ISO_REGIONS_ALPHA2 } from "@/lib/isoRegions";

export type CountryOption = { code: string; name: string };

function safeSupportedRegions(): string[] {
  try {
    // @ts-expect-error Intl.supportedValuesOf may be missing from TS lib
    const vals = Intl.supportedValuesOf?.("region");
    return Array.isArray(vals) ? vals : [];
  } catch {
    return [];
  }
}

export function buildCountryList(localeTag = "en"): CountryOption[] {
  const regions = safeSupportedRegions();
  const base = regions.length > 0 ? regions : ISO_REGIONS_ALPHA2;
  const dn = new Intl.DisplayNames([localeTag], { type: "region" });

  return base
    .filter((r) => /^[A-Za-z]{2}$/.test(r))
    .map((code) => ({
      code: code.toUpperCase(),
      name: dn.of(code.toUpperCase()) || code.toUpperCase()
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function countryNameForCode(countries: CountryOption[], code: string) {
  const normalized = String(code || "")
    .trim()
    .toUpperCase();
  return countries.find((c) => c.code === normalized)?.name || normalized;
}
