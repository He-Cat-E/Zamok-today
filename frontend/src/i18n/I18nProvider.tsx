"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Dict = Record<string, string>;

function normalizeLanguageTag(tag: string): string {
  return String(tag || "en").split(/[-_]/)[0]!.toLowerCase() || "en";
}

type I18nContextValue = {
  lang: string;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function readLangFromStorage(): string {
  try {
    const raw = window.localStorage.getItem("zamok_locale");
    if (!raw) return "en";
    const parsed = JSON.parse(raw) as Partial<{ language: string }>;
    return parsed.language ? String(parsed.language) : "en";
  } catch {
    return "en";
  }
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [langTag, setLangTag] = useState("en");
  const [dict, setDict] = useState<Dict>({});
  const [enDict, setEnDict] = useState<Dict>({});

  useEffect(() => {
    setLangTag(readLangFromStorage());

    function onStorage(e: StorageEvent) {
      if (e.key === "zamok_locale") setLangTag(readLangFromStorage());
    }
    function onCustom() {
      setLangTag(readLangFromStorage());
    }

    window.addEventListener("storage", onStorage);
    window.addEventListener("zamok:locale-change", onCustom as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("zamok:locale-change", onCustom as EventListener);
    };
  }, []);

  const lang = useMemo(() => normalizeLanguageTag(langTag), [langTag]);

  useEffect(() => {
    // Basic RTL support
    const rtl = lang === "he";
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    document.documentElement.lang = lang || "en";
  }, [lang]);

  useEffect(() => {
    let cancelled = false;

    async function loadLocale(primary: string) {
      try {
        const res = await fetch(`/locales/${primary}.json`, { cache: "no-cache" });
        if (!res.ok) throw new Error("missing");
        return (await res.json()) as Dict;
      } catch {
        return null;
      }
    }

    async function run() {
      // Load English baseline once (fallback)
      if (Object.keys(enDict).length === 0) {
        const base = (await loadLocale("en")) || {};
        if (!cancelled) setEnDict(base);
      }

      if (lang === "en") {
        const base = (await loadLocale("en")) || {};
        if (!cancelled) setDict(base);
        return;
      }

      const loaded = await loadLocale(lang);
      if (!cancelled) setDict(loaded || {});
    }

    void run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const value = useMemo<I18nContextValue>(() => {
    return {
      lang: langTag,
      t: (key) => dict[key] ?? enDict[key] ?? key
    };
  }, [dict, enDict, langTag]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useT must be used within I18nProvider");
  return ctx.t;
}

