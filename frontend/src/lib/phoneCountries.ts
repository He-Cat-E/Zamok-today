import { buildCountryList, type CountryOption } from "@/lib/countries";
import { dialCodeForCountry } from "@/lib/phone";

export type PhoneCountryOption = CountryOption & {
  dialCode: string;
};

export function buildPhoneCountryList(localeTag = "en"): PhoneCountryOption[] {
  return buildCountryList(localeTag)
    .map((c) => {
      const dialCode = dialCodeForCountry(c.code);
      if (!dialCode) return null;
      return { ...c, dialCode };
    })
    .filter((c): c is PhoneCountryOption => c !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
}
