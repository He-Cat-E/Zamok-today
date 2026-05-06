"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { searchFlights, setFlightSearchForm } from "@/store/flightsSlice";
import { useT } from "@/i18n/I18nProvider";
import { FaBed } from "react-icons/fa6";
import { BiSolidPlaneAlt } from "react-icons/bi";
import { FiCalendar, FiMapPin, FiSearch, FiShuffle, FiUser, FiX } from "react-icons/fi";
import { TwoMonthDatePicker } from "@/components/date/TwoMonthDatePicker";
import { MobileDateRangePicker } from "@/components/date/MobileDateRangePicker";
import { PassengersPicker } from "@/components/PassengersPicker";
import { SITE_DEFAULT_TO_CITY, SITE_PRIMARY_FROM_CITY } from "@/lib/siteDefaults";

const cabins = [
  { value: "economy", label: "Economy" },
  { value: "premium", label: "Premium economy" },
  { value: "business", label: "Business" },
  { value: "first", label: "First" }
] as const;

function parseYmd(ymd: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  if (!y || !m || !d) return null;
  const dt = new Date(y, m - 1, d);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

function formatPrettyDate(ymd: string) {
  const dt = parseYmd(ymd);
  if (!dt) return ymd;
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "long",
    day: "numeric"
  }).format(dt);
}

function cn(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

type PaxState = {
  adults: number;
  children: number;
  infants: number;
  cabin: (typeof cabins)[number]["value"];
};

function FlightSearchContent({
  from,
  setFrom,
  to,
  setTo,
  departDate,
  setDepartDate,
  returnDate,
  setReturnDate,
  pax,
  setPax,
  tab,
  setTab,
  openBooking,
  setOpenBooking,
  activeDateField,
  setActiveDateField,
  isMobileViewport,
  onSearch,
  compact = false,
  pickersActive = true,
  showBottomActions = true,
  showTabs = true
}: {
  from: string;
  setFrom: (v: string) => void;
  to: string;
  setTo: (v: string) => void;
  departDate: string;
  setDepartDate: (v: string) => void;
  returnDate: string;
  setReturnDate: (v: string) => void;
  pax: PaxState;
  setPax: (v: PaxState) => void;
  tab: "flights" | "hotels";
  setTab: (v: "flights" | "hotels") => void;
  openBooking: boolean;
  setOpenBooking: (v: boolean) => void;
  activeDateField: null | "depart" | "return";
  setActiveDateField: (v: null | "depart" | "return") => void;
  isMobileViewport: boolean;
  onSearch: () => void;
  compact?: boolean;
  pickersActive?: boolean;
  showBottomActions?: boolean;
  showTabs?: boolean;
}) {
  const t = useT();
  const prettyDepart = formatPrettyDate(departDate);
  const prettyReturn = returnDate ? formatPrettyDate(returnDate) : "";
  const mobileDateLabel = prettyReturn ? `${prettyDepart} - ${prettyReturn}` : prettyDepart || t("search.departure");

  return (
    <div className={cn("w-full flex flex-col justify-center", compact ? "gap-3" : "gap-3.5 md:gap-8")}>
      {showTabs ? (
      <div className={cn("w-[250px] md:w-full flex items-center justify-center mx-auto")}>
        <div
          className={[
            compact
              ? "inline-flex w-[250px] rounded-2xl p-1.5 ring-1"
              : "inline-flex w-full max-w-[320px] rounded-2xl p-1 ring-1",
            "bg-red-700/35 ring-white/20 backdrop-blur",
            "dark:bg-white/10 dark:ring-white/15"
          ].join(" ")}
        >
          <button
            type="button"
            onClick={() => setTab("flights")}
            className={[
              compact
                ? "w-[116px] rounded-xl px-2.5 py-2 text-xs font-semibold transition"
                : "flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition",
              tab === "flights"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-white/85 hover:text-white"
            ].join(" ")}
          >
            <span className={cn("items-center justify-center", compact ? "flex gap-1.5" : "flex flex-col gap-1")}>
              <BiSolidPlaneAlt className={cn(compact ? "h-5 w-5" : "hidden md:block h-5 w-5")} />
              <span>{t("tabs.flights")}</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setTab("hotels")}
            className={[
              compact
                ? "w-[116px] rounded-xl px-2.5 py-2 text-xs font-semibold transition ml-2"
                : "ml-2 flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition",
              tab === "hotels"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-white/85 hover:text-white"
            ].join(" ")}
          >
            <span className={cn("items-center justify-center", compact ? "flex gap-1.5" : "flex flex-col gap-1")}>
              <FaBed className={cn(compact ? "h-5 w-5" : "hidden md:block h-5 w-5")} />
              <span>{t("tabs.hotels")}</span>
            </span>
          </button>
        </div>
      </div>
      ) : null}

      <div>
        <div className="w-full">
          <div className="overflow-hidden rounded-3xl bg-white text-slate-900 ring-1 ring-black/10 dark:bg-black dark:text-white dark:ring-white/15 md:hidden">
            <div className="flex items-center gap-5 w-full px-3">
              <FiSearch className="h-5 w-5 text-slate-900 dark:text-white/80" />
              <div className="flex flex-col w-full">
                <div className="py-4 text-[14px] font-semibold leading-none border-b border-slate-300/90 dark:border-white/10">
                  <input
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-full bg-transparent text-[14px] outline-none placeholder:text-slate-400 dark:placeholder:text-white/35"
                    placeholder={t("search.from")}
                  />
                </div>
                <div className="flex items-center gap-3 border-t border-slate-300/90 py-3 dark:border-white/10">
                  <input
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full bg-transparent text-[14px] outline-none placeholder:text-slate-400 dark:placeholder:text-white/35"
                    placeholder={t("search.to")}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-slate-300/90 dark:border-white/10">
              <div className="flex min-w-0 items-center px-3 py-3.5">
                <button
                  type="button"
                  onClick={() => setActiveDateField(activeDateField === "depart" ? null : "depart")}
                  className="flex min-w-0 items-center gap-3 text-left"
                >
                  <FiCalendar className="h-5 w-5 text-slate-500 dark:text-white/70" />
                  <span className="truncate text-[14px]">{mobileDateLabel}</span>
                </button>
                {departDate || returnDate ? (
                  <button
                    type="button"
                    onClick={() => {
                      setDepartDate("");
                      setReturnDate("");
                      setActiveDateField(null);
                    }}
                    className="ml-2 grid h-8 w-8 shrink-0 place-items-center rounded-md text-blue-600 transition hover:bg-slate-100 dark:text-blue-400 dark:hover:bg-white/10"
                    aria-label="Clear dates"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                ) : null}
              </div>
              <div className="border-l border-slate-300/90 py-1 w-[200px] overflow-hidden dark:border-white/10">
                <div className="flex items-center gap-3 px-4">
                  <FiUser className="h-5 w-5 text-slate-500 dark:text-white/70" />
                  <div className="min-w-0 flex-1">
                    <PassengersPicker value={pax} onChange={setPax} />
                  </div>
                </div>
              </div>
            </div>
            {isMobileViewport && pickersActive && (activeDateField === "depart" || activeDateField === "return") ? (
              <MobileDateRangePicker
                departDate={departDate}
                returnDate={returnDate}
                initialField={activeDateField === "return" ? "return" : "depart"}
                onChange={({ departDate: nextDepart, returnDate: nextReturn }) => {
                  setDepartDate(nextDepart);
                  setReturnDate(nextReturn);
                }}
                onClose={() => setActiveDateField(null)}
                departureLabel={t("search.departure")}
                returnLabel={t("search.return")}
              />
            ) : null}
          </div>

          <div className="hidden w-full grid-cols-1 gap-2 overflow-visible md:grid md:grid-cols-6">
            <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-black/10 dark:bg-black dark:ring-white/15">
              <div className="text-xs text-slate-500">{t("search.from")}</div>
              <input
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="mt-1 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                placeholder="Los Angeles"
              />
            </div>
            <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-black/10 dark:bg-black dark:ring-white/15">
              <div className="text-xs text-slate-500">{t("search.to")}</div>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="mt-1 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                placeholder="Where to?"
              />
            </div>
            <div className="relative rounded-2xl bg-white px-4 py-3 ring-1 ring-black/10 dark:bg-black dark:ring-white/15">
              <div className="text-xs text-slate-500">{t("search.departure")}</div>
              <button
                type="button"
                onClick={() => setActiveDateField(activeDateField === "depart" ? null : "depart")}
                className="mt-1 h-5 w-full text-left bg-transparent text-sm leading-5 outline-none pr-8 text-slate-900 dark:text-white"
              >
                {prettyDepart}
              </button>
              {departDate ? (
                <button
                  type="button"
                  onClick={() => {
                    setDepartDate("");
                    setReturnDate("");
                    setActiveDateField(null);
                  }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:bg-slate-100 dark:text-white/70 dark:hover:bg-white/10"
                  aria-label="Clear departure date"
                >
                  <FiX className="h-5 w-5" />
                </button>
              ) : (
                <FiCalendar className="pointer-events-none absolute right-4 top-1/2 text-slate-500" />
              )}
              {!isMobileViewport && pickersActive && activeDateField === "depart" ? (
                <TwoMonthDatePicker
                  value={departDate}
                  rangeStartYmd={departDate}
                  rangeEndYmd={returnDate || undefined}
                  onChange={(ymd) => setDepartDate(ymd)}
                  onClose={() => setActiveDateField(null)}
                />
              ) : null}
            </div>
            <div className="relative rounded-2xl bg-white px-4 py-3 ring-1 ring-black/10 dark:bg-black dark:ring-white/15">
              <div className="text-xs text-slate-500">{t("search.return")}</div>
              <button
                type="button"
                onClick={() => setActiveDateField(activeDateField === "return" ? null : "return")}
                className="mt-1 h-5 w-full text-left bg-transparent text-sm leading-5 outline-none pr-8 text-slate-900 dark:text-white"
              >
                {prettyReturn}
              </button>
              {returnDate ? (
                <button
                  type="button"
                  onClick={() => {
                    setReturnDate("");
                    setActiveDateField(null);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:bg-slate-100 dark:text-white/70 dark:hover:bg-white/10"
                  aria-label="Clear return date"
                >
                  <FiX className="h-5 w-5" />
                </button>
              ) : (
                <FiCalendar className="pointer-events-none absolute right-4 top-1/2 text-slate-500" />
              )}
              {!isMobileViewport && pickersActive && activeDateField === "return" ? (
                <TwoMonthDatePicker
                  value={returnDate || undefined}
                  minYmd={departDate}
                  rangeStartYmd={departDate}
                  rangeEndYmd={returnDate || undefined}
                  onChange={(ymd) => setReturnDate(ymd)}
                  onClose={() => setActiveDateField(null)}
                />
              ) : null}
            </div>
            <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-black/10 dark:bg-black dark:ring-white/15">
              <PassengersPicker value={pax} onChange={setPax} />
            </div>
            <button
              onClick={() => {
                if (tab !== "flights") return;
                onSearch();
              }}
              className="w-full rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition ring-1 ring-black/10 md:rounded-2xl md:px-5 md:py-3"
              disabled={tab !== "flights"}
              type="button"
            >
              {t("search.searchFlights")}
            </button>
          </div>

          <button
            onClick={() => {
              if (tab !== "flights") return;
              onSearch();
            }}
            className="mt-2.5 w-full rounded-2xl bg-orange-500 px-5 py-3 text-[16px] font-semibold text-white hover:bg-orange-600 transition ring-1 ring-black/10 md:hidden"
            disabled={tab !== "flights"}
            type="button"
          >
            {t("search.searchFlights")}
          </button>
        </div>

        {showBottomActions ? (
          <>
          <div className="mt-14 grid grid-cols-2 gap-3 md:hidden">
            <Link
              href="/map"
              className="inline-flex flex-col items-center justify-center gap-2 rounded-3xl bg-white px-4 py-3 text-[12px] font-semibold text-slate-900 ring-1 ring-black/10 dark:bg-black dark:text-white dark:ring-white/15"
            >
              <span className="grid h-11 w-11 -mt-12 place-items-center rounded-full bg-green-100 ring-1 ring-green-200">
                <FiMapPin className="h-6 w-6 text-green-600" />
              </span>
              {t("search.anywhere")}
            </Link>
            <a
              href="#"
              className="inline-flex flex-col items-center justify-center gap-2 rounded-3xl bg-white px-4 py-4 text-[12px] font-semibold text-slate-900 ring-1 ring-black/10 dark:bg-black dark:text-white dark:ring-white/15"
            >
              <span className="grid h-11 w-11 -mt-12 place-items-center rounded-full bg-blue-100 ring-1 ring-blue-200">
                <FiShuffle className="h-6 w-6 text-blue-600" />
              </span>
              {t("search.multiCity")}
            </a>
          </div>

          <div className="mt-2 hidden flex-col gap-2 px-0 py-2 text-xs md:flex md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-white/90 ring-1 ring-white/20 hover:bg-white/20 hover:text-white transition"
            >
              <FiShuffle className="h-4 w-4" />
              {t("search.multiCity")}
            </a>
            <Link
              href="/map"
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-white/90 ring-1 ring-white/20 hover:bg-white/20 hover:text-white transition"
            >
              <FiMapPin className="h-4 w-4" />
              {t("search.anywhere")}
            </Link>
          </div>

          <label className="inline-flex select-none items-center gap-3 text-white/90">
            <span className="relative inline-flex items-center">
              <input
                type="checkbox"
                checked={openBooking}
                onChange={(e) => setOpenBooking(e.target.checked)}
                className="peer sr-only"
              />
              <span
                className={[
                  "h-6 w-11 rounded-full ring-1 transition",
                  "ring-white/25 bg-white/15",
                  "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-white/80 peer-focus-visible:outline-offset-2",
                  "peer-checked:bg-white peer-checked:ring-white"
                ].join(" ")}
                aria-hidden="true"
              />
              <span
                className={[
                  "pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full transition",
                  "bg-white shadow-sm",
                  "peer-checked:translate-x-5 peer-checked:bg-red-600"
                ].join(" ")}
                aria-hidden="true"
              />
            </span>
            <span className="font-semibold">{t("search.openBooking")}</span>
          </label>
          </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export function FlightSearch({
  stickyEnabled = true,
  forceCompact = false,
  showBottomActions = true,
  initialFrom = SITE_PRIMARY_FROM_CITY,
  initialTo = SITE_DEFAULT_TO_CITY
}: {
  stickyEnabled?: boolean;
  forceCompact?: boolean;
  showBottomActions?: boolean;
  initialFrom?: string;
  initialTo?: string;
}) {
  const dispatch = useAppDispatch();
  const originCityName = useAppSelector((s) => s.locale.originCityName);
  const persistedSearchForm = useAppSelector((s) => s.flights.searchForm);
  const preferInitialRouteValues =
    initialFrom !== SITE_PRIMARY_FROM_CITY || initialTo !== SITE_DEFAULT_TO_CITY;

  const [from, setFrom] = useState(preferInitialRouteValues ? initialFrom : persistedSearchForm.from || initialFrom);
  const [to, setTo] = useState(preferInitialRouteValues ? initialTo : persistedSearchForm.to || initialTo);
  const [departDate, setDepartDate] = useState(persistedSearchForm.departDate || "");
  const [returnDate, setReturnDate] = useState(persistedSearchForm.returnDate || "");
  const [pax, setPax] = useState<PaxState>({
    adults: persistedSearchForm.adults,
    children: persistedSearchForm.children,
    infants: persistedSearchForm.infants,
    cabin: persistedSearchForm.cabin
  });
  const [tab, setTab] = useState<"flights" | "hotels">("flights");
  const [openBooking, setOpenBooking] = useState(true);
  const [activeDateField, setActiveDateField] = useState<null | "depart" | "return">(null);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [reservedHeight, setReservedHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!stickyEnabled) {
      setStickyVisible(false);
      return;
    }
    function onScroll() {
      setStickyVisible(window.scrollY > 200);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [stickyEnabled]);

  useEffect(() => {
    function syncViewport() {
      setIsMobileViewport(window.innerWidth < 768);
    }
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  useEffect(() => {
    if (!returnDate) return;
    if (returnDate < departDate) setReturnDate("");
  }, [departDate, returnDate]);

  useEffect(() => {
    const city = String(originCityName || "").trim();
    if (!city) return;
    const shouldAutofillFromLocation =
      !preferInitialRouteValues && from.trim().toLowerCase() === SITE_PRIMARY_FROM_CITY.toLowerCase();
    if (!shouldAutofillFromLocation) return;
    setFrom(city);
  }, [from, originCityName, preferInitialRouteValues]);

  useEffect(() => {
    const reduxFrom = String(persistedSearchForm.from || "").trim();
    if (!reduxFrom) return;
    const localFrom = String(from || "").trim();
    const isLocalDefault = localFrom.toLowerCase() === SITE_PRIMARY_FROM_CITY.toLowerCase();
    // Sync async Redux updates (e.g. location bootstrap) into visible input,
    // but avoid overriding user-entered values.
    if (!localFrom || isLocalDefault) {
      setFrom(reduxFrom);
    }
  }, [from, persistedSearchForm.from]);

  useEffect(() => {
    dispatch(
      setFlightSearchForm({
        from,
        to,
        departDate,
        returnDate,
        adults: pax.adults,
        children: pax.children,
        infants: pax.infants,
        cabin: pax.cabin
      })
    );
  }, [departDate, dispatch, from, pax.adults, pax.cabin, pax.children, pax.infants, returnDate, to]);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const measure = () => {
      const next = Math.ceil(el.getBoundingClientRect().height);
      setReservedHeight((prev) => (prev !== next ? next : prev));
    };

    measure();

    const observer = new ResizeObserver(() => {
      measure();
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [stickyVisible, isMobileViewport, forceCompact, showBottomActions]);

  function onSearch() {
    const passengers = pax.adults + pax.children + pax.infants;
    void dispatch(
      searchFlights({
        from: from.trim(),
        to: to.trim(),
        departDate,
        returnDate: returnDate || undefined,
        passengers,
        cabin: pax.cabin
      })
    );
  }

  const isPinnedCompact = stickyEnabled && stickyVisible;
  const compactMode = forceCompact || isPinnedCompact;
  const mobilePinned = isPinnedCompact && isMobileViewport;

  return (
    <div style={{ height: isPinnedCompact ? `${reservedHeight}px` : undefined }}>
      <div
        ref={contentRef}
        className={cn(
          isPinnedCompact
            ? "fixed left-0 right-0 top-16 z-40 bg-red-600/95 dark:bg-black/95 backdrop-blur px-4 py-2 shadow-sm"
            : "relative"
        )}
      >
        <div className={cn(isPinnedCompact ? "mx-auto w-full max-w-[1440px] px-4" : "")}>
          <FlightSearchContent
            from={from}
            setFrom={setFrom}
            to={to}
            setTo={setTo}
            departDate={departDate}
            setDepartDate={setDepartDate}
            returnDate={returnDate}
            setReturnDate={setReturnDate}
            pax={pax}
            setPax={setPax}
            tab={tab}
            setTab={setTab}
            openBooking={openBooking}
            setOpenBooking={setOpenBooking}
            activeDateField={activeDateField}
            setActiveDateField={setActiveDateField}
            isMobileViewport={isMobileViewport}
            onSearch={onSearch}
            compact={compactMode}
            pickersActive
            showBottomActions={showBottomActions && !mobilePinned}
            showTabs={!compactMode && !mobilePinned}
          />
        </div>
      </div>
    </div>
  );
}

