"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BiSolidPlaneAlt } from "react-icons/bi";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { DestinationTicketCard } from "@/components/DestinationTicketCard";
import { FlightSearch } from "@/components/FlightSearch";
import { SiteFooter } from "@/components/SiteFooter";
import { Topbar } from "@/components/Topbar";
import { useI18n } from "@/i18n/I18nProvider";
import { buildFlightSearchResultsHref, SITE_PRIMARY_FROM_CITY } from "@/lib/siteDefaults";
import { getDestinationBySlug } from "@/lib/siteDestinationData";
import { recoleta } from "@/theme/fonts";

export default function DestinationCountryPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : Array.isArray(params?.slug) ? params.slug[0]! : "";
  const data = useMemo(() => getDestinationBySlug(slug), [slug]);
  const { t } = useI18n();

  const tr = (key: string, fallback: string) => {
    const v = t(key);
    return v === key ? fallback : v;
  };

  const [cityStart, setCityStart] = useState(0);
  const [visibleCities, setVisibleCities] = useState(4);
  const [filterCity, setFilterCity] = useState<string | "all">("all");
  const [allCitiesOpen, setAllCitiesOpen] = useState(false);
  const [ticketStart, setTicketStart] = useState(0);
  const visibleTickets = 2;

  useEffect(() => {
    function sync() {
      const w = window.innerWidth;
      if (w >= 1024) setVisibleCities(4);
      else if (w >= 640) setVisibleCities(2);
      else setVisibleCities(1);
    }
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const filteredTickets = useMemo(() => {
    if (!data) return [];
    if (filterCity === "all") return data.tickets;
    return data.tickets.filter((x) => x.toCity === filterCity);
  }, [data, filterCity]);

  const maxCityStart = useMemo(() => {
    if (!data) return 0;
    return Math.max(0, data.cities.length - visibleCities);
  }, [data, visibleCities]);

  const maxTicketStart = useMemo(
    () => Math.max(0, filteredTickets.length - visibleTickets),
    [filteredTickets.length, visibleTickets]
  );

  useEffect(() => {
    if (cityStart > maxCityStart) setCityStart(maxCityStart);
  }, [maxCityStart, cityStart]);

  useEffect(() => {
    if (ticketStart > maxTicketStart) setTicketStart(maxTicketStart);
  }, [maxTicketStart, ticketStart]);

  useEffect(() => {
    setTicketStart(0);
  }, [filterCity, slug]);

  useEffect(() => {
    if (!allCitiesOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [allCitiesOpen]);

  useEffect(() => {
    if (!allCitiesOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setAllCitiesOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [allCitiesOpen]);

  if (!data) {
    notFound();
  }

  const showCitySlider = data.cities.length > visibleCities;
  const showTicketSlider = filteredTickets.length > visibleTickets;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-black">
      <Topbar />
      <section className="sticky top-16 z-40 bg-red-600 dark:bg-black shadow-sm">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-2">
          <FlightSearch
            stickyEnabled={false}
            forceCompact
            showBottomActions={false}
            initialFrom={SITE_PRIMARY_FROM_CITY}
            initialTo={data.country}
          />
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1240px] px-4 py-8">
        <div className="mb-8 flex items-center gap-3">
          <span className={`fi fi-${data.regionCode} h-[30px] w-[40px] shrink-0`} />
          <h1 className={`${recoleta.className} text-3xl font-bold text-slate-900 dark:text-white md:text-4xl`}>
            {data.country}
          </h1>
        </div>

        <section className="mb-8 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-black dark:ring-white/10 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className={`${recoleta.className} text-2xl font-semibold text-slate-900 dark:text-white`}>
              {tr("destination.citiesTitle", "Cities")}
            </h2>
            {showCitySlider ? (
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCityStart((s) => Math.max(0, s - 1))}
                  disabled={cityStart === 0}
                  className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:text-white/80 dark:hover:bg-white/10"
                  aria-label="Previous cities"
                >
                  <FiChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setCityStart((s) => Math.min(maxCityStart, s + 1))}
                  disabled={cityStart >= maxCityStart}
                  className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:text-white/80 dark:hover:bg-white/10"
                  aria-label="Next cities"
                >
                  <FiChevronRight className="h-5 w-5" />
                </button>
              </div>
            ) : null}
          </div>

          <div className="overflow-hidden">
            {showCitySlider ? (
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${cityStart * (100 / visibleCities)}%)` }}
              >
                {data.cities.map((city) => (
                  <Link
                    key={city.name}
                    href={buildFlightSearchResultsHref(city.name)}
                    className="block shrink-0 px-2 cursor-pointer"
                    style={{ width: `${100 / visibleCities}%` }}
                  >
                    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-black">
                      <div className="relative h-44">
                        <Image
                          src={city.image}
                          alt={city.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, 25vw"
                        />
                      </div>
                      <div className="p-4">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{city.name}</div>
                        <div className="mt-1 text-xs text-slate-500 dark:text-white/70">
                          <span className="inline-flex items-center gap-2">
                            <BiSolidPlaneAlt className="h-4 w-4" />
                            {tr("common.from", "from")}{" "}
                            <span className="font-semibold text-slate-800 dark:text-white">${city.fromPrice}</span>
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {data.cities.map((city) => (
                  <Link
                    key={city.name}
                    href={buildFlightSearchResultsHref(city.name)}
                    className="block min-w-0 cursor-pointer"
                  >
                    <article className="group min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-black">
                      <div className="relative h-44">
                        <Image
                          src={city.image}
                          alt={city.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, 25vw"
                        />
                      </div>
                      <div className="p-4">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{city.name}</div>
                        <div className="mt-1 text-xs text-slate-500 dark:text-white/70">
                          <span className="inline-flex items-center gap-2">
                            <BiSolidPlaneAlt className="h-4 w-4" />
                            {tr("common.from", "from")}{" "}
                            <span className="font-semibold text-slate-800 dark:text-white">${city.fromPrice}</span>
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {showCitySlider ? (
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={() => setAllCitiesOpen(true)}
                className="w-full max-w-md rounded-2xl bg-slate-100 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 transition hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:ring-white/15 dark:hover:bg-white/15 md:w-auto md:px-12"
              >
                {tr("destination.showAll", "Show all")}
              </button>
            </div>
          ) : null}
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-black dark:ring-white/10 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className={`${recoleta.className} text-2xl font-semibold text-slate-900 dark:text-white`}>
              {tr("destination.cheapestTitle", "Cheapest tickets")}
            </h2>
            {showTicketSlider ? (
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTicketStart((s) => Math.max(0, s - 1))}
                  disabled={ticketStart === 0}
                  className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:text-white/80 dark:hover:bg-white/10"
                  aria-label={tr("destination.ticketsPrev", "Previous tickets")}
                >
                  <FiChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setTicketStart((s) => Math.min(maxTicketStart, s + 1))}
                  disabled={ticketStart >= maxTicketStart}
                  className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:text-white/80 dark:hover:bg-white/10"
                  aria-label={tr("destination.ticketsNext", "Next tickets")}
                >
                  <FiChevronRight className="h-5 w-5" />
                </button>
              </div>
            ) : null}
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilterCity("all")}
              className={[
                "rounded-full px-4 py-2 text-sm font-semibold ring-1 transition",
                filterCity === "all"
                  ? "bg-red-600 text-white ring-red-600"
                  : "bg-slate-100 text-slate-800 ring-slate-200 hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:ring-white/15 dark:hover:bg-white/15"
              ].join(" ")}
            >
              {tr("destination.filterAll", "All")}
            </button>
            {data.cities.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setFilterCity(c.name)}
                className={[
                  "rounded-full px-4 py-2 text-sm font-semibold ring-1 transition",
                  filterCity === c.name
                    ? "bg-red-600 text-white ring-red-600"
                    : "bg-slate-100 text-slate-800 ring-slate-200 hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:ring-white/15 dark:hover:bg-white/15"
                ].join(" ")}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="pb-2 pt-1">
            {showTicketSlider ? (
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${ticketStart * (100 / visibleTickets)}%)` }}
                >
                  {filteredTickets.map((ticket) => (
                    <div key={ticket.id} className="shrink-0 px-1.5 sm:px-2" style={{ width: `${100 / visibleTickets}%` }}>
                      <DestinationTicketCard
                        ticket={ticket}
                        fromCity={SITE_PRIMARY_FROM_CITY}
                        directLabel={tr("destination.ticketDirect", "Direct")}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {filteredTickets.map((ticket) => (
                  <DestinationTicketCard
                    key={ticket.id}
                    ticket={ticket}
                    fromCity={SITE_PRIMARY_FROM_CITY}
                    directLabel={tr("destination.ticketDirect", "Direct")}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {allCitiesOpen ? (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="destination-all-cities-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            aria-label={tr("destination.closeAllCities", "Close")}
            onClick={() => setAllCitiesOpen(false)}
          />
          <div className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl ring-1 ring-slate-200 dark:bg-zinc-900 dark:ring-white/10 sm:max-h-[85vh] sm:rounded-3xl">
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-white/10 sm:px-6">
              <h2
                id="destination-all-cities-title"
                className={`${recoleta.className} text-xl font-bold text-slate-900 dark:text-white sm:text-2xl`}
              >
                {tr("destination.allCitiesTitle", "All cities")} — {data.country}
              </h2>
              <button
                type="button"
                onClick={() => setAllCitiesOpen(false)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-100 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
                aria-label={tr("destination.closeAllCities", "Close")}
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.cities.map((city) => (
                  <Link
                    key={city.name}
                    href={buildFlightSearchResultsHref(city.name)}
                    aria-label={`${city.name}, ${tr("common.from", "from")} $${city.fromPrice}`}
                    onClick={() => setAllCitiesOpen(false)}
                    className="block text-left"
                  >
                    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:ring-2 hover:ring-red-500/30 dark:border-white/10 dark:bg-black">
                      <div className="relative h-36">
                        <Image
                          src={city.image}
                          alt=""
                          fill
                          aria-hidden
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, 33vw"
                        />
                      </div>
                      <div className="p-3 sm:p-4">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{city.name}</div>
                        <div className="mt-1 text-xs text-slate-500 dark:text-white/70">
                          <span className="inline-flex items-center gap-2">
                            <BiSolidPlaneAlt className="h-4 w-4" />
                            {tr("common.from", "from")}{" "}
                            <span className="font-semibold text-slate-800 dark:text-white">${city.fromPrice}</span>
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <SiteFooter />
    </main>
  );
}
