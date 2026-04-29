"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLocale } from "@/store/localeSlice";

function LocalePersistence() {
  const dispatch = useAppDispatch();
  const locale = useAppSelector((s) => s.locale);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("zamok_locale");
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<{
        country: string;
        language: string;
        currency: string;
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

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <LocalePersistence />
      {children}
    </Provider>
  );
}

