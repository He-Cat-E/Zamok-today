"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLocale } from "@/store/localeSlice";
import { setFlightSearchForm } from "@/store/flightsSlice";
import { env } from "@/lib/env";
import { fetchAuthUser } from "@/store/authSlice";
function LocalePersistence() {
  const dispatch = useAppDispatch();
  const locale = useAppSelector((s) => s.locale);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("zamok_locale");
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<{
        country: string;
        countryName: string;
        language: string;
        currency: string;
        originIata: string;
        originCityName: string;
      }>;
      dispatch(setLocale(parsed));
    } catch {
      // ignore malformed local data
    }
  }, [dispatch]);

  useEffect(() => {
    try {
      window.localStorage.setItem("zamok_locale", JSON.stringify(locale));
      window.dispatchEvent(new Event("zamok:locale-change"));
    } catch {
      // ignore persistence failures
    }
  }, [locale]);

  return null;
}

function FlightSearchPersistence() {
  const dispatch = useAppDispatch();
  const searchForm = useAppSelector((s) => s.flights.searchForm);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("zamok_flight_search_form");
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<{
        from: string;
        fromIata: string;
        to: string;
        departDate: string;
        returnDate: string;
        adults: number;
        children: number;
        infants: number;
        cabin: "economy" | "premium" | "business" | "first";
      }>;
      dispatch(setFlightSearchForm(parsed));
    } catch {
      // ignore malformed local data
    }
  }, [dispatch]);

  useEffect(() => {
    try {
      window.localStorage.setItem("zamok_flight_search_form", JSON.stringify(searchForm));
    } catch {
      // ignore persistence failures
    }
  }, [searchForm]);

  return null;
}

function AuthBootstrap() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(fetchAuthUser());
  }, [dispatch]);

  return null;
}

function LocationBootstrap() {
  const dispatch = useAppDispatch();
  const language = useAppSelector((s) => s.locale.language);

  useEffect(() => {
    const lang = String(language || "en").split("-")[0]?.toLowerCase() || "en";
    const url = new URL(`${env.apiBaseUrl}/api/locale/whereami`);
    url.searchParams.set("locale", lang);

    void fetch(url.toString(), { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) return null;
        return (await res.json()) as {
          cityIata?: string | null;
          cityName?: string | null;
          countryCode?: string | null;
          countryName?: string | null;
        };
      })
      .then((data) => {
        if (!data) return;
        const country = String(data.countryCode || "")
          .trim()
          .toUpperCase();
        const countryName = String(data.countryName || "").trim();
        const originIata = String(data.cityIata || "")
          .trim()
          .toUpperCase();
        const originCityName = String(data.cityName || "").trim();
        dispatch(
          setLocale({
            country: /^[A-Z]{2}$/.test(country) ? country : undefined,
            countryName: countryName || "",
            originIata: /^[A-Z]{3}$/.test(originIata) ? originIata : "",
            originCityName: originCityName || ""
          })
        );
        if (originCityName) {
          // Keep global search state in sync on first location resolution.
          dispatch(
            setFlightSearchForm({
              from: originCityName,
              fromIata: /^[A-Z]{3}$/.test(originIata) ? originIata : ""
            })
          );
        }
      })
      .catch(() => {
        // keep defaults if location lookup fails
      });
  }, [dispatch, language]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <LocalePersistence />
      <FlightSearchPersistence />
      <AuthBootstrap />
      <LocationBootstrap />
      {children}
    </Provider>
  );
}

