"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBed } from "react-icons/fa6";
import { BiSolidPlaneAlt } from "react-icons/bi";
import { BsFillPatchQuestionFill } from "react-icons/bs";
import { FiChevronDown, FiMenu, FiMoon, FiSun, FiX } from "react-icons/fi";
import { LocalePicker } from "@/components/LocalePicker";
import { useT } from "@/i18n/I18nProvider";
import { useTheme } from "@/theme/ThemeProvider";
import { recoleta } from "@/theme/fonts";

function topbarTabsAlwaysVisible(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname === "/map" || pathname.startsWith("/destinations") || pathname.startsWith("/search/flights");
}

/** Insurance mega-menu items (order preserved). i18n keys → see `public/locales/en.json` nav.insurance.item.* */
const INSURANCE_MENU_ITEM_KEYS = [
  "nav.insurance.item.comprehensiveCar",
  "nav.insurance.item.traffic",
  "nav.insurance.item.health",
  "nav.insurance.item.home",
  "nav.insurance.item.workplace",
  "nav.insurance.item.travel",
  "nav.insurance.item.dask",
  "nav.insurance.item.personalAccident",
  "nav.insurance.item.life",
  "nav.insurance.item.individualPension",
  "nav.insurance.item.supplementaryHealth",
  "nav.insurance.item.cargo",
  "nav.insurance.item.engineering",
  "nav.insurance.item.liability"
] as const;

const INSURANCE_ITEM_HREF: Partial<Record<(typeof INSURANCE_MENU_ITEM_KEYS)[number], string>> = {
  "nav.insurance.item.comprehensiveCar": "/insurance/comprehensive-car",
  "nav.insurance.item.health": "/insurance/health",
  "nav.insurance.item.home": "/insurance/home",
  "nav.insurance.item.travel": "/insurance/travel"
};

function InsuranceMegaMenuContent({
  onNavigate,
  className
}: {
  onNavigate: () => void;
  className?: string;
}) {
  const t = useT();
  return (
    <ul
      className={[
        "grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className || ""
      ].join(" ")}
    >
      {INSURANCE_MENU_ITEM_KEYS.map((key) => {
        const href = INSURANCE_ITEM_HREF[key] ?? "#";
        const className =
          "block rounded-lg py-2 px-3 text-sm font-medium leading-snug text-slate-700 transition hover:bg-slate-50 hover:text-red-600 dark:text-white/85 dark:hover:bg-white/5 dark:hover:text-red-400";
        if (href !== "#") {
          return (
            <li key={key}>
              <Link
                href={href}
                className={className}
                onClick={() => onNavigate()}
              >
                {t(key)}
              </Link>
            </li>
          );
        }
        return (
          <li key={key}>
            <a href="#" className={className} onClick={() => onNavigate()}>
              {t(key)}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function Topbar() {
  const t = useT();
  const pathname = usePathname();
  const { resolved, toggle } = useTheme();
  const isDark = resolved === "dark";
  const showSearchTabs = topbarTabsAlwaysVisible(pathname);
  const [activeTab, setActiveTab] = useState<"flights" | "hotels">("flights");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [insuranceOpen, setInsuranceOpen] = useState(false);
  const [mobileInsuranceOpen, setMobileInsuranceOpen] = useState(false);
  const insuranceWrapRef = useRef<HTMLDivElement | null>(null);
  const insuranceMegaPanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!insuranceOpen) return;
    function handleMouseDown(e: MouseEvent) {
      const node = e.target as Node;
      if (insuranceWrapRef.current?.contains(node)) return;
      if (insuranceMegaPanelRef.current?.contains(node)) return;
      setInsuranceOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setInsuranceOpen(false);
    }
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [insuranceOpen]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileNavOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileNavOpen]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen]);

  const navLinkClass =
    "whitespace-nowrap px-5 py-2 text-sm font-semibold text-white/95 transition hover:bg-white/10 hover:text-white";

  const closeAllMenus = () => {
    setInsuranceOpen(false);
    setMobileNavOpen(false);
    setMobileInsuranceOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-red-600 dark:bg-black">
      <div className="relative mx-auto w-full max-w-[1440px] px-3 sm:px-4">
        <div className="flex h-14 items-center gap-2 lg:h-16 lg:gap-4">
          <button
            type="button"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white hover:bg-white/10 lg:hidden"
            aria-expanded={mobileNavOpen}
            aria-label={mobileNavOpen ? t("nav.menu.close") : t("nav.menu.open")}
            onClick={() => {
              setMobileNavOpen((o) => !o);
              setInsuranceOpen(false);
            }}
          >
            {mobileNavOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
          </button>

          <Link href="/" className="flex min-w-0 shrink items-center gap-2 sm:gap-3">
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl sm:h-10 sm:w-10">
              <Image src="/logo.png" alt="Zamok Today" width={40} height={40} className="h-9 w-9 object-cover sm:h-10 sm:w-10" priority />
            </div>
            <div className="hidden leading-tight sm:block">
              <div className={`${recoleta.className} text-xl font-semibold text-white sm:text-2xl`}>Zamok Today</div>
            </div>
          </Link>

          <nav className="mx-auto hidden max-h-none flex-1 items-center justify-center gap-2 overflow-x-auto lg:flex xl:gap-0" aria-label="Primary">
            <Link href="/" className={navLinkClass}>
              {t("tabs.flights")}
            </Link>
            <a href="#" className={navLinkClass}>
              {t("tabs.hotels")}
            </a>
            <a href="#" className={navLinkClass}>
              {t("nav.buses")}
            </a>
            <a href="#" className={navLinkClass}>
              {t("nav.ferries")}
            </a>
            <a href="#" className={navLinkClass}>
              {t("nav.cars")}
            </a>

            <div ref={insuranceWrapRef} className="relative">
              <button
                type="button"
                className={[
                  navLinkClass,
                  "inline-flex items-center gap-1",
                  insuranceOpen ? "bg-white/15 text-white" : ""
                ].join(" ")}
                aria-expanded={insuranceOpen}
                aria-haspopup="true"
                onClick={() => setInsuranceOpen((o) => !o)}
              >
                {t("nav.insurance")}
                <FiChevronDown className={`h-4 w-4 shrink-0 transition ${insuranceOpen ? "rotate-180" : ""}`} />
              </button>
            </div>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 text-xs text-white/90 sm:gap-4">
            <a
              className="hidden items-center gap-2 rounded-full bg-slate-100 px-2 py-1.5 text-xs font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-200 sm:inline-flex md:px-3"
              href="#"
            >
              <BsFillPatchQuestionFill className="h-4 w-4" />
              <span className="hidden lg:inline">{t("topbar.support")}</span>
            </a>
            <LocalePicker />
            <button
              type="button"
              onClick={toggle}
              role="switch"
              aria-checked={isDark}
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
              className={[
                "group relative inline-flex h-8 w-14 shrink-0 items-center rounded-full p-1",
                "transition-colors duration-200",
                "ring-1 ring-inset",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black",
                "bg-slate-200 ring-slate-300/80 focus-visible:ring-slate-400",
                "dark:bg-white/10 dark:ring-white/15 dark:focus-visible:ring-white/40"
              ].join(" ")}
            >
              <span className="pointer-events-none absolute inset-0 flex items-center justify-between px-2 text-xs font-semibold">
                <span className="text-slate-700/70 group-hover:text-slate-700/90 dark:text-white/55 dark:group-hover:text-white/70">
                  <FiSun className="h-4 w-4" />
                </span>
                <span className="text-slate-700/70 group-hover:text-slate-700/90 dark:text-white/55 dark:group-hover:text-white/70">
                  <FiMoon className="h-4 w-4" />
                </span>
              </span>
              <span
                className={[
                  "relative z-10 h-5 w-5 rounded-full",
                  "shadow-sm ring-1 ring-black/10",
                  "transition-transform duration-200 ease-out",
                  "bg-white",
                  "dark:bg-white dark:ring-white/20",
                  "group-active:scale-[0.98]",
                  isDark ? "translate-x-7" : "translate-x-0"
                ].join(" ")}
              />
            </button>
          </div>
        </div>

        {insuranceOpen ? (
          <div
            ref={insuranceMegaPanelRef}
            className="fixed inset-x-0 top-14 z-[60] max-h-[calc(100vh-3.5rem)] overflow-y-auto border-t border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-zinc-950 lg:top-16"
            role="dialog"
            aria-label={t("nav.insurance")}
          >
            <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6">
              <InsuranceMegaMenuContent onNavigate={() => setInsuranceOpen(false)} />
            </div>
          </div>
        ) : null}
      </div>

      {mobileNavOpen ? (
        <div className="fixed inset-x-0 top-14 bottom-0 z-[55] overflow-y-auto border-t border-white/15 bg-red-700 shadow-inner dark:bg-black lg:hidden">
          <nav className="flex flex-col px-4 py-4" aria-label="Primary mobile">
            <Link href="/" className="rounded-xl px-3 py-3 text-base font-semibold text-white hover:bg-white/10" onClick={closeAllMenus}>
              {t("tabs.flights")}
            </Link>
            <a href="#" className="rounded-xl px-3 py-3 text-base font-semibold text-white hover:bg-white/10" onClick={closeAllMenus}>
              {t("tabs.hotels")}
            </a>
            <a href="#" className="rounded-xl px-3 py-3 text-base font-semibold text-white hover:bg-white/10" onClick={closeAllMenus}>
              {t("nav.buses")}
            </a>
            <a href="#" className="rounded-xl px-3 py-3 text-base font-semibold text-white hover:bg-white/10" onClick={closeAllMenus}>
              {t("nav.ferries")}
            </a>
            <a href="#" className="rounded-xl px-3 py-3 text-base font-semibold text-white hover:bg-white/10" onClick={closeAllMenus}>
              {t("nav.cars")}
            </a>

            {showSearchTabs ? (
              <div className="mt-2 rounded-2xl border border-white/20 bg-red-800/40 p-2 dark:bg-white/10">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("flights")}
                    className={[
                      "flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold",
                      activeTab === "flights" ? "bg-white text-slate-900" : "text-white/90"
                    ].join(" ")}
                  >
                    <BiSolidPlaneAlt className="h-4 w-4" />
                    {t("tabs.flights")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("hotels")}
                    className={[
                      "flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold",
                      activeTab === "hotels" ? "bg-white text-slate-900" : "text-white/90"
                    ].join(" ")}
                  >
                    <FaBed className="h-4 w-4" />
                    {t("tabs.hotels")}
                  </button>
                </div>
              </div>
            ) : null}

            <button
              type="button"
              className="flex items-center justify-between rounded-xl px-3 py-3 text-left text-base font-semibold text-white hover:bg-white/10"
              aria-expanded={mobileInsuranceOpen}
              onClick={() => setMobileInsuranceOpen((o) => !o)}
            >
              {t("nav.insurance")}
              <FiChevronDown className={`h-5 w-5 shrink-0 transition ${mobileInsuranceOpen ? "rotate-180" : ""}`} />
            </button>

            {mobileInsuranceOpen ? (
              <div className="mb-4 rounded-2xl bg-white p-4 text-slate-900 shadow-lg dark:bg-zinc-900 dark:text-white">
                <InsuranceMegaMenuContent onNavigate={closeAllMenus} />
              </div>
            ) : null}

            <a
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900"
              href="#"
              onClick={closeAllMenus}
            >
              <BsFillPatchQuestionFill className="h-4 w-4" />
              {t("topbar.support")}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
