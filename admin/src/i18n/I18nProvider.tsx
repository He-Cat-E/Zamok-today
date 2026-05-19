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
import { DEFAULT_ADMIN_LANG, normalizeAdminLang, type AdminLangCode } from "@/i18n/locales";
import enLocale from "../../public/locales/en.json";
import trLocale from "../../public/locales/tr.json";

type Dict = Record<string, string>;

type I18nContextValue = {
  lang: AdminLangCode;
  setLang: (code: AdminLangCode) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);
const STORAGE_KEY = "zamok_admin_lang";

/** English base, Turkish overrides — default UI language. */
const TR_PRIMARY_DICT: Dict = { ...enLocale, ...trLocale };

function readStoredLang(): AdminLangCode {
  try {
    return normalizeAdminLang(localStorage.getItem(STORAGE_KEY) || DEFAULT_ADMIN_LANG);
  } catch {
    return DEFAULT_ADMIN_LANG;
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<AdminLangCode>(DEFAULT_ADMIN_LANG);
  const [dict, setDict] = useState<Dict>(TR_PRIMARY_DICT);
  const [enDict, setEnDict] = useState<Dict>(enLocale);
  const [trDict, setTrDict] = useState<Dict>(TR_PRIMARY_DICT);

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
      const enMerged: Dict = { ...enLocale, ...enFetched };

      const trFetched = (await load("tr")) || {};
      const trMerged: Dict = { ...enMerged, ...trLocale, ...trFetched };

      if (cancelled) return;
      setEnDict(enMerged);
      setTrDict(trMerged);

      if (lang === DEFAULT_ADMIN_LANG) {
        setDict(trMerged);
        return;
      }
      if (lang === "en") {
        setDict(enMerged);
        return;
      }
      const loaded = await load(lang);
      if (!cancelled) {
        setDict({ ...trMerged, ...(loaded || {}) });
      }
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
      t: (key) => dict[key] ?? trDict[key] ?? enDict[key] ?? key
    }),
    [lang, setLang, dict, trDict, enDict]
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
