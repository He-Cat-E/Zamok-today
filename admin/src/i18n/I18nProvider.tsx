"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { normalizeAdminLang, type AdminLangCode } from "@/i18n/locales";
import enLocale from "../../public/locales/en.json";

type Dict = Record<string, string>;

type I18nContextValue = {
  lang: AdminLangCode;
  setLang: (code: AdminLangCode) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);
const STORAGE_KEY = "zamok_admin_lang";

function readStoredLang(): AdminLangCode {
  try {
    return normalizeAdminLang(localStorage.getItem(STORAGE_KEY) || "en");
  } catch {
    return "en";
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<AdminLangCode>("en");
  const [dict, setDict] = useState<Dict>(enLocale);
  const [enDict, setEnDict] = useState<Dict>(enLocale);

  useEffect(() => {
    setLangState(readStoredLang());
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    let cancelled = false;

    async function load(code: string) {
      try {
        const res = await fetch(`/locales/${code}.json`, { cache: "no-cache" });
        if (!res.ok) return null;
        return (await res.json()) as Dict;
      } catch {
        return null;
      }
    }

    async function run() {
      const enFetched = (await load("en")) || {};
      const enMerged = { ...enLocale, ...enFetched };
      if (!cancelled) setEnDict(enMerged);

      if (lang === "en") {
        if (!cancelled) setDict(enMerged);
        return;
      }
      const loaded = await load(lang);
      if (!cancelled) setDict({ ...enMerged, ...(loaded || {}) });
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [lang]);

  const setLang = useCallback((code: AdminLangCode) => {
    const next = normalizeAdminLang(code);
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      lang,
      setLang,
      t: (key) => dict[key] ?? enDict[key] ?? key
    }),
    [lang, setLang, dict, enDict]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function useT() {
  return useI18n().t;
}
