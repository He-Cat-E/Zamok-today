"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ISO_REGIONS_ALPHA2 } from "@/lib/isoRegions";
import { useT } from "@/i18n/I18nProvider";
import { FiCheck, FiGlobe, FiSearch } from "react-icons/fi";

type Tab = "country" | "language" | "currency";

type Country = { code: string; name: string; flag: string };
type Language = { code: string; name: string };
type Currency = { code: string; name: string; symbol: string };
const FAV_CURRENCIES = new Set(["USD", "EUR"]);

function safeSupportedValuesOf(type: "region" | "language" | "currency"): string[] {
  try {
    // Modern Chromium/Firefox/Safari: returns all values supported by Intl on this device.
    // @ts-expect-error Intl.supportedValuesOf is not in older TS libs by default.
    const vals = Intl.supportedValuesOf?.(type);
    return Array.isArray(vals) ? vals : [];
  } catch {
    return [];
  }
}

function flagEmojiFromRegion(regionCode: string) {
  // Regional indicator symbols: 🇦 is 0x1F1E6. For ASCII A-Z.
  const code = regionCode.toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return "🏳️";
  const A = 0x1f1e6;
  const chars = Array.from(code).map((c) => String.fromCodePoint(A + (c.charCodeAt(0) - 65)));
  return chars.join("");
}

function FlagIcon({ region }: { region: string }) {
  const code = region.toLowerCase();
  // flag-icons uses ISO 3166-1 alpha-2 lowercased: fi fi-us
  return (
    <span
      className={`fi fi-${code}`}
      aria-hidden="true"
      style={{
        borderRadius: 4,
        boxShadow: "0 0 0 1px rgba(15, 23, 42, 0.08)",
        width: "100%",
        height: "100%"
      }}
    />
  );
}

const LANGUAGE_TO_REGION: Record<string, string> = {
  en: "gb",
  es: "es",
  fr: "fr",
  de: "de",
  it: "it",
  pt: "pt",
  ru: "ru",
  uk: "ua",
  tr: "tr",
  hi: "in",
  ja: "jp",
  zh: "cn",
  nl: "nl",
  sv: "se",
  no: "no",
  da: "dk",
  fi: "fi",
  pl: "pl",
  ro: "ro",
  el: "gr",
  he: "il",
  vi: "vn",
  th: "th",
  id: "id",
  ms: "my"
};

function cn(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

function currencySymbolFromCode(code: string): string {
  try {
    const parts = new Intl.NumberFormat("en", {
      style: "currency",
      currency: code,
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).formatToParts(1);
    const symbol = parts.find((p) => p.type === "currency")?.value?.trim();
    return symbol || code;
  } catch {
    return code;
  }
}

export function LocalePicker() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("country");
  const [query, setQuery] = useState("");

  const [country, setCountry] = useState("US");
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("USD");

  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("zamok_locale");
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<{
        country: string;
        language: string;
        currency: string;
      }>;
      if (parsed.country) setCountry(String(parsed.country).toUpperCase());
      if (parsed.language) setLanguage(String(parsed.language));
      if (parsed.currency) setCurrency(String(parsed.currency).toUpperCase());
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        "zamok_locale",
        JSON.stringify({ country, language, currency })
      );
      window.dispatchEvent(new Event("zamok:locale-change"));
    } catch {
      // ignore
    }
  }, [country, language, currency]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onPointerDown(e: MouseEvent) {
      const el = rootRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, []);

  const allCountries = useMemo<Country[]>(() => {
    const regions = safeSupportedValuesOf("region");
    const dn = new Intl.DisplayNames(["en"], { type: "region" });
    const base =
      regions.length > 0
        ? regions
        : ISO_REGIONS_ALPHA2;

    return base
      .filter((r) => /^[A-Za-z]{2}$/.test(r))
      .map((code) => ({
        code: code.toUpperCase(),
        name: dn.of(code.toUpperCase()) || code.toUpperCase(),
        flag: flagEmojiFromRegion(code) // kept for fallback accessibility
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const allLanguages = useMemo<Language[]>(() => {
    const langs = safeSupportedValuesOf("language");
    const dn = new Intl.DisplayNames(["en"], { type: "language" });
    const base =
      langs.length > 0
        ? langs
        : [
            "en","es","fr","de","it","pt","ru","zh","tr","uk","hi","ja",
            "nl","sv","no","da","fi","pl","ro","el","he","vi","th","id","ms"
          ];

    const uniq = Array.from(new Set(base.map((t) => String(t))));
    return uniq
      .filter((t) => /^[A-Za-z]{2,3}([_-][A-Za-z0-9]{2,8})*$/.test(t))
      .map((code) => ({
        code,
        name: dn.of(code) || code
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const allCurrencies = useMemo<Currency[]>(() => {
    const curr = safeSupportedValuesOf("currency");
    // Intl.DisplayNames('currency') exists in modern engines. If missing, fall back to code-only.
    let dn: Intl.DisplayNames | undefined;
    try {
      dn = new Intl.DisplayNames(["en"], { type: "currency" as any });
    } catch {
      dn = undefined;
    }
    const base = curr.length > 0 ? curr : ["USD", "EUR", "GBP", "JPY", "CNY", "RUB", "TRY"];

    const uniq = new Map<string, string>();
    for (const c of base) {
      const code = String(c).toUpperCase();
      if (!/^[A-Z]{3}$/.test(code)) continue;
      uniq.set(code, code);
    }

    return Array.from(uniq.values())
      .map((code) => ({
        code,
        name: (dn?.of?.(code) as string | undefined) || code,
        symbol: currencySymbolFromCode(code)
      }))
      .sort((a, b) => {
        const aFav = FAV_CURRENCIES.has(a.code);
        const bFav = FAV_CURRENCIES.has(b.code);
        if (aFav !== bFav) return aFav ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
  }, []);

  const filteredCountries = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allCountries;
    return allCountries.filter(
      (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
  }, [allCountries, query]);

  const filteredLanguages = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allLanguages;
    return allLanguages.filter(
      (l) => l.name.toLowerCase().includes(q) || l.code.toLowerCase().includes(q)
    );
  }, [allLanguages, query]);

  const filteredCurrencies = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = !q
      ? allCurrencies
      : allCurrencies.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.code.toLowerCase().includes(q) ||
            c.symbol.toLowerCase().includes(q)
        );
    return [...base].sort((a, b) => {
      const aFav = FAV_CURRENCIES.has(a.code);
      const bFav = FAV_CURRENCIES.has(b.code);
      if (aFav !== bFav) return aFav ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }, [allCurrencies, query]);

  const currentCountry = allCountries.find((c) => c.code === country) || allCountries[0]!;

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="hidden sm:inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-white ring-1 ring-slate-200 dark:ring-white/15 hover:bg-slate-200 dark:hover:bg-white/15"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <FiGlobe className="h-4 w-4" />
        {currency} • {language.toUpperCase()}
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+10px)] w-[420px] rounded-2xl bg-white dark:bg-black shadow-xl ring-1 ring-black/10 dark:ring-white/10">
          <div className="p-3">
            <div className="grid grid-cols-3 rounded-2xl bg-slate-100 dark:bg-white/10 p-1 ring-1 ring-slate-200 dark:ring-white/15">
              <button
                type="button"
                onClick={() => {
                  setTab("country");
                  setQuery("");
                }}
                className={cn(
                  "rounded-xl px-3 py-2 text-xs font-semibold",
                  tab === "country"
                    ? "bg-white dark:bg-black text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                Country
                <div className="text-xs font-medium text-slate-500 dark:text-white/60">{country}</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab("language");
                  setQuery("");
                }}
                className={cn(
                  "rounded-xl px-3 py-2 text-xs font-semibold",
                  tab === "language"
                    ? "bg-white dark:bg-black text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                Language
                <div className="text-xs font-medium text-slate-500 dark:text-white/60">
                  {language.toUpperCase()}
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab("currency");
                  setQuery("");
                }}
                className={cn(
                  "rounded-xl px-3 py-2 text-xs font-semibold",
                  tab === "currency"
                    ? "bg-white dark:bg-black text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                Currency
                <div className="text-xs font-medium text-slate-500 dark:text-white/60">{currency}</div>
              </button>
            </div>

            {tab === "country" ? (
              <div className="mt-3 px-1">
                <div className="text-xs text-slate-700 dark:text-white/80">
                  {t("locale.countryHint")}
                </div>
              </div>
            ) : null}

            <div className="mt-3">
              <div className="flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-white/10 px-3 py-2 ring-1 ring-slate-200 dark:ring-white/15">
                <FiSearch className="h-4 w-4 text-slate-500 dark:text-white/60" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("locale.searchPlaceholder")}
                  className="w-full bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-white/40"
                />
              </div>
            </div>

            <div className="mt-3 max-h-[340px] overflow-auto pr-1">
              {tab === "country" ? (
                <div className="divide-y divide-slate-100 dark:divide-white/10">
                  {filteredCountries.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => setCountry(c.code)}
                      className="flex w-full items-center justify-between gap-3 px-2 py-3 text-left hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-5 w-6 overflow-hidden rounded-[4px]">
                          <FlagIcon region={c.code} />
                        </div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{c.name}</div>
                      </div>
                      {c.code === country ? (
                        <FiCheck className="h-5 w-5 text-slate-500 dark:text-white/60" />
                      ) : (
                        <div className="w-4" />
                      )}
                    </button>
                  ))}
                </div>
              ) : null}

              {tab === "language" ? (
                <div className="divide-y divide-slate-100 dark:divide-white/10">
                  {filteredLanguages.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setLanguage(l.code)}
                      className="flex w-full items-center justify-between gap-3 px-2 py-3 text-left hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        {LANGUAGE_TO_REGION[l.code.split(/[-_]/)[0]!.toLowerCase()] ? (
                          <div className="h-5 w-8 overflow-hidden rounded-[4px]">
                            <FlagIcon
                              region={LANGUAGE_TO_REGION[l.code.split(/[-_]/)[0]!.toLowerCase()]!}
                            />
                          </div>
                        ) : (
                          <div className="grid h-5 w-8 place-items-center rounded-[4px] bg-slate-100 dark:bg-white/10 text-xs text-slate-600 dark:text-white/70 ring-1 ring-slate-200 dark:ring-white/15">
                            <FiGlobe className="h-4 w-4" />
                          </div>
                        )}
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                          {l.name}
                          <span className="ml-2 text-xs font-medium text-slate-500 dark:text-white/60">
                            {l.code.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      {l.code === language ? (
                        <FiCheck className="h-5 w-5 text-slate-500 dark:text-white/60" />
                      ) : (
                        <div className="w-4" />
                      )}
                    </button>
                  ))}
                </div>
              ) : null}

              {tab === "currency" ? (
                <div className="divide-y divide-slate-100 dark:divide-white/10">
                  {filteredCurrencies.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => setCurrency(c.code)}
                      className="flex w-full items-center justify-between gap-3 px-2 py-3 text-left hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 text-sm font-bold text-slate-900 dark:text-white">
                          {c.code}
                        </div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                          {c.name} <span className="font-medium text-slate-600 dark:text-white/70">· {c.symbol}</span>
                        </div>
                      </div>
                      {c.code === currency ? (
                        <FiCheck className="h-5 w-5 text-slate-500 dark:text-white/60" />
                      ) : (
                        <div className="w-4" />
                      )}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

          </div>
        </div>
      ) : null}
    </div>
  );
}

