"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FiCheck, FiGlobe, FiSearch, FiX } from "react-icons/fi";
import { dropdownPanel, localePickerBtn } from "@/components/layout/layoutUi";
import { languageDisplayName, languageRegion } from "@/i18n/languageMeta";
import { ADMIN_SUPPORTED_LANGUAGES, type AdminLangCode } from "@/i18n/locales";
import { useI18n, useT } from "@/i18n/I18nProvider";

type LangOption = { code: AdminLangCode; name: string; region: string };

export function AdminLanguagePicker() {
  const t = useT();
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const languages = useMemo<LangOption[]>(
    () =>
      ADMIN_SUPPORTED_LANGUAGES.map((code) => ({
        code,
        name: languageDisplayName(code),
        region: languageRegion(code)
      })).sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return languages;
    return languages.filter(
      (l) => l.name.toLowerCase().includes(q) || l.code.toLowerCase().includes(q)
    );
  }, [languages, query]);

  const current = languages.find((l) => l.code === lang) ?? languages[0];

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 0);
    function onDown(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={[localePickerBtn, open ? "ring-2 ring-brand-500/40" : ""].join(" ")}
        aria-expanded={open}
        aria-label={t("topbar.language")}
      >
        <span className="flex flex-col items-center justify-center gap-[3px]">
          <FiGlobe className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-300" strokeWidth={2} aria-hidden />
        </span>
      </button>

      {open ? (
        <div className={`${dropdownPanel} w-72`}>
          <div className="border-b border-zinc-100 p-2 dark:border-zinc-800">
            <div className="flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
              <FiSearch className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("topbar.searchLanguages")}
                className="min-w-0 flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  aria-label="Clear"
                >
                  <FiX className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </div>
          <ul className="max-h-72 overflow-y-auto py-1" role="listbox">
            {filtered.map((l) => (
              <li key={l.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={lang === l.code}
                  onClick={() => {
                    setLang(l.code);
                    setOpen(false);
                    setQuery("");
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-zinc-800 transition-colors hover:bg-zinc-50 dark:text-zinc-100 dark:hover:bg-zinc-800"
                >
                  <span
                    className={`fi fi-${l.region} block h-3.5 w-5 shrink-0 overflow-hidden rounded-[2px]`}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1 truncate">{l.name}</span>
                  <span className="text-[10px] font-semibold uppercase text-zinc-400">{l.code}</span>
                  {lang === l.code ? <FiCheck className="h-4 w-4 shrink-0 text-brand-600" /> : null}
                </button>
              </li>
            ))}
            {filtered.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-zinc-400">—</li>
            ) : null}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
