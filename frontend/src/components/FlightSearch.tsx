"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { searchFlights } from "@/store/flightsSlice";
import { useT } from "@/i18n/I18nProvider";
import { FaBed } from "react-icons/fa6";
import { BiSolidPlaneAlt } from "react-icons/bi";
import { FiCalendar, FiMapPin, FiShuffle } from "react-icons/fi";
import { TwoMonthDatePicker } from "@/components/date/TwoMonthDatePicker";
import { PassengersPicker } from "@/components/PassengersPicker";

const cabins = [
  { value: "economy", label: "Economy" },
  { value: "premium", label: "Premium economy" },
  { value: "business", label: "Business" },
  { value: "first", label: "First" }
] as const;

function todayYmd() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
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
  onSearch,
  compact = false,
  pickersActive = true
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
  onSearch: () => void;
  compact?: boolean;
  pickersActive?: boolean;
}) {
  const t = useT();

  return (
    <div className={cn("w-full flex flex-col", compact ? "gap-3" : "gap-8")}>
      <div className={cn("flex items-center justify-center")}>
        <div
          className={[
            compact
              ? "inline-flex w-[250px] rounded-2xl p-1.5 ring-1"
              : "inline-flex w-[260px] rounded-3xl p-1 ring-1",
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
                : "w-[120px] rounded-2xl px-3 py-2 text-xs font-semibold transition",
              tab === "flights"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-white/85 hover:text-white"
            ].join(" ")}
          >
            <span className={cn("items-center justify-center", compact ? "flex gap-1.5" : "flex flex-col gap-1")}>
              <BiSolidPlaneAlt className={cn(compact ? "h-5 w-5" : "h-7 w-7 mt-1")} />
              <span>{t("tabs.flights")}</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setTab("hotels")}
            className={[
              compact
                ? "w-[116px] rounded-xl px-2.5 py-2 text-xs font-semibold transition ml-2"
                : "w-[120px] rounded-2xl px-3 ml-3 py-2 text-xs font-semibold transition",
              tab === "hotels"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-white/85 hover:text-white"
            ].join(" ")}
          >
            <span className={cn("items-center justify-center", compact ? "flex gap-1.5" : "flex flex-col gap-1")}>
              <FaBed className={cn(compact ? "h-5 w-5" : "h-7 w-7 mt-1")} />
              <span>{t("tabs.hotels")}</span>
            </span>
          </button>
        </div>
      </div>

      <div>
        <div className="w-full">
          <div className="grid w-full grid-cols-1 gap-2 overflow-visible md:grid-cols-6">
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
                className="mt-1 w-full text-left bg-transparent text-sm outline-none pr-8 text-slate-900 dark:text-white"
              >
                {departDate}
              </button>
              <FiCalendar className="pointer-events-none absolute right-4 top-1/2 text-slate-500" />
              {pickersActive && activeDateField === "depart" ? (
                <TwoMonthDatePicker value={departDate} onChange={(ymd) => setDepartDate(ymd)} onClose={() => setActiveDateField(null)} />
              ) : null}
            </div>
            <div className="relative rounded-2xl bg-white px-4 py-3 ring-1 ring-black/10 dark:bg-black dark:ring-white/15">
              <div className="text-xs text-slate-500">{t("search.return")}</div>
              <button
                type="button"
                onClick={() => setActiveDateField(activeDateField === "return" ? null : "return")}
                className="mt-1 w-full text-left bg-transparent text-sm outline-none pr-2 text-slate-900 dark:text-white"
              >
                {returnDate || "mm/dd/yyyy"}
              </button>
              {pickersActive && activeDateField === "return" ? (
                <TwoMonthDatePicker
                  value={returnDate || undefined}
                  minYmd={departDate}
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
              className="w-full rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition ring-1 ring-black/10"
              disabled={tab !== "flights"}
              type="button"
            >
              {t("search.searchFlights")}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 px-0 py-2 mt-2 text-xs md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-white/90 ring-1 ring-white/20 hover:bg-white/20 hover:text-white transition"
            >
              <FiShuffle className="h-4 w-4" />
              {t("search.multiCity")}
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-white/90 ring-1 ring-white/20 hover:bg-white/20 hover:text-white transition"
            >
              <FiMapPin className="h-4 w-4" />
              {t("search.anywhere")}
            </a>
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
      </div>
    </div>
  );
}

export function FlightSearch({
}) {
  const dispatch = useAppDispatch();
  const defaultDate = useMemo(() => todayYmd(), []);

  const [from, setFrom] = useState("NYC");
  const [to, setTo] = useState("LAX");
  const [departDate, setDepartDate] = useState(defaultDate);
  const [returnDate, setReturnDate] = useState("");
  const [pax, setPax] = useState<PaxState>({ adults: 1, children: 0, infants: 0, cabin: "economy" });
  const [tab, setTab] = useState<"flights" | "hotels">("flights");
  const [openBooking, setOpenBooking] = useState(true);
  const [activeDateField, setActiveDateField] = useState<null | "depart" | "return">(null);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [reservedHeight, setReservedHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onScroll() {
      setStickyVisible(window.scrollY > 200);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!returnDate) return;
    if (returnDate < departDate) setReturnDate("");
  }, [departDate, returnDate]);

  useEffect(() => {
    function measure() {
      if (!contentRef.current) return;
      setReservedHeight(contentRef.current.offsetHeight);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [stickyVisible, tab, openBooking, activeDateField, departDate, returnDate, pax, from, to]);

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

  return (
    <div style={{ height: stickyVisible ? `${reservedHeight}px` : undefined }}>
      <div
        ref={contentRef}
        className={cn(
          stickyVisible
            ? "fixed left-0 right-0 top-14 z-30 bg-red-600/95 dark:bg-black/95 backdrop-blur px-4 py-3 shadow-sm"
            : "relative"
        )}
      >
        <div className={cn(stickyVisible ? "mx-auto w-full max-w-[1440px] px-4" : "")}>
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
            onSearch={onSearch}
            compact={stickyVisible}
            pickersActive
          />
        </div>
      </div>
    </div>
  );
}

