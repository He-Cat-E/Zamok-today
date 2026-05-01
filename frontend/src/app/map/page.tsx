"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BiSolidPlaneAlt } from "react-icons/bi";
import { FiChevronLeft, FiChevronRight, FiMapPin, FiMaximize2, FiMinimize2 } from "react-icons/fi";
import { LuArrowDownUp } from "react-icons/lu";
import { FlightSearch } from "@/components/FlightSearch";
import { Topbar } from "@/components/Topbar";
import { useI18n } from "@/i18n/I18nProvider";
import { recoleta } from "@/theme/fonts";
import { useTheme } from "@/theme/ThemeProvider";
import { buildFlightSearchResultsHref, SITE_PRIMARY_FROM_CITY } from "@/lib/siteDefaults";
import { getMapCountryGroups, type MapCountryGroup } from "@/lib/siteDestinationData";

const LeafletMap = dynamic(() => import("@/components/map/LeafletMap").then((m) => m.LeafletMap), { ssr: false });

const groups: MapCountryGroup[] = getMapCountryGroups();

export default function MapPage() {
  const router = useRouter();
  const { lang, t } = useI18n();
  const { resolved } = useTheme();
  const isDark = resolved === "dark";
  const [mapExpanded, setMapExpanded] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [mobileFullMapOpen, setMobileFullMapOpen] = useState(false);
  const [focusedCountry, setFocusedCountry] = useState<string | null>(null);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"popularity" | "price">("popularity");
  const [visibleCount, setVisibleCount] = useState(4);
  const [startByCountry, setStartByCountry] = useState<Record<string, number>>({});
  const sortMenuRef = useRef<HTMLDivElement | null>(null);
  const focusedGroup = useMemo(
    () => (focusedCountry ? groups.find((g) => g.regionCode === focusedCountry) || null : null),
    [focusedCountry]
  );
  const groupsToRender = focusedGroup ? [focusedGroup] : groups;
  const mapPoints = useMemo(() => {
    const source = focusedGroup ? [focusedGroup] : groups;
    return source.flatMap((g) =>
      g.cities.map((c) => ({
        name: c.name,
        price: c.fromPrice,
        lat: c.lat,
        lng: c.lng
      }))
    );
  }, [focusedGroup]);
  const regionNames = useMemo(() => {
    try {
      return new Intl.DisplayNames([String(lang || "en")], { type: "region" });
    } catch {
      return new Intl.DisplayNames(["en"], { type: "region" });
    }
  }, [lang]);
  const tr = (key: string, fallback: string) => {
    const value = t(key);
    return value === key ? fallback : value;
  };

  const openRouteResults = useCallback(
    (cityName: string) => {
      router.push(buildFlightSearchResultsHref(cityName));
    },
    [router]
  );

  useEffect(() => {
    function syncVisibleCount() {
      const w = window.innerWidth;
      setIsMobileViewport(w < 768);
      if (w < 768) {
        setVisibleCount(2);
        return;
      }
      setVisibleCount(mapExpanded ? 2 : 4);
    }
    syncVisibleCount();
    window.addEventListener("resize", syncVisibleCount);
    return () => window.removeEventListener("resize", syncVisibleCount);
  }, [mapExpanded]);

  useEffect(() => {
    setStartByCountry((prev) => {
      const next: Record<string, number> = {};
      for (const g of groups) {
        const maxStart = Math.max(0, g.cities.length - visibleCount);
        next[g.country] = Math.min(prev[g.country] ?? 0, maxStart);
      }
      return next;
    });
  }, [visibleCount]);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (!sortMenuRef.current) return;
      if (!sortMenuRef.current.contains(e.target as Node)) setSortMenuOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  useEffect(() => {
    if (!mobileFullMapOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileFullMapOpen]);

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
            initialTo={tr("search.anywhere", "Anywhere")}
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-4 py-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div
            className={[
              "transition-all duration-500 ease-out",
              mapExpanded ? "lg:w-1/3" : "lg:w-2/3"
            ].join(" ")}
          >
            {focusedGroup ? (
              <div>
                <button
                  type="button"
                  onClick={() => setFocusedCountry(null)}
                  className="mb-4 inline-flex items-center gap-2 rounded-2xl bg-transparent px-4 py-2 text-sm font-semibold text-red-600 ring-1 ring-red-500 transition hover:bg-red-50 dark:text-white dark:ring-white/25 dark:hover:bg-white/10"
                >
                  <FiChevronLeft className="h-4 w-4" />
                  {tr("map.allCountries", "All countries")}
                </button>
                <div className="mt-2 flex items-center gap-3">
                  <span className={`fi fi-${focusedGroup.regionCode} h-6 w-6`} />
                  <div className={`${recoleta.className} text-4xl font-bold text-slate-900 dark:text-white`}>
                    {regionNames.of(focusedGroup.regionCode.toUpperCase()) || focusedGroup.country}
                  </div>
                </div>
              </div>
            ) : (
              <div className={`${recoleta.className} text-3xl font-bold text-slate-900 dark:text-white`}>
                {tr("search.anywhere", "Anywhere")}
              </div>
            )}
            <div className="sticky top-[152px] z-30 bg-slate-50 pt-5 pb-4 dark:bg-black">
              <div className="flex flex-wrap items-center gap-2">
                <div ref={sortMenuRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setSortMenuOpen((v) => !v)}
                    className="rounded-2xl bg-white px-4 py-2 text-sm text-slate-600 ring-1 ring-slate-200 dark:bg-white/10 dark:text-white/80 dark:ring-white/15"
                    aria-expanded={sortMenuOpen}
                    aria-haspopup="menu"
                  >
                    <span className="flex flex-col items-center leading-none">
                      <LuArrowDownUp className="h-5 w-5" />
                    </span>
                  </button>
                  {sortMenuOpen ? (
                    <div className="absolute left-0 top-[52px] w-[250px] rounded-3xl bg-white p-2 shadow-xl ring-1 ring-slate-200 dark:bg-black dark:ring-white/10">
                      <button
                        type="button"
                        onClick={() => {
                          setSortBy("popularity");
                          setSortMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-[14px] text-slate-900 hover:bg-slate-50 dark:text-white dark:hover:bg-white/10"
                      >
                        <span className={["h-4 w-4 rounded-full ring-1", sortBy === "popularity" ? "bg-blue-500 ring-blue-500" : "ring-slate-300 dark:ring-white/30"].join(" ")} />
                        {tr("map.sort.popularity", "Popularity")}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSortBy("price");
                          setSortMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-[14px] text-slate-900 hover:bg-slate-50 dark:text-white dark:hover:bg-white/10"
                      >
                        <span className={["h-4 w-4 rounded-full ring-1", sortBy === "price" ? "bg-blue-500 ring-blue-500" : "ring-slate-300 dark:ring-white/30"].join(" ")} />
                        {tr("map.sort.price", "Price")}
                      </button>
                    </div>
                  ) : null}
                </div>
                <button className="rounded-2xl bg-white px-5 py-1.5 text-slate-700 ring-1 ring-slate-200 dark:bg-white/10 dark:text-white dark:ring-white/15">
                  {tr("map.filter.directFlights", "Direct flights")}
                </button>
                <button className="rounded-2xl bg-white px-5 py-1.5 ring-1 ring-slate-200 dark:bg-white/10 dark:text-white dark:ring-white/15">
                  {tr("map.filter.baggageIncluded", "Baggage included")}
                </button>
              </div>
            </div>

            <div className="relative h-[80px] py-3 mb-3 rounded-3xl w-full md:hidden">
              <Image
                src={isDark ? "/Images/dark-map1.png" : "/Images/light-map1.png"}
                alt={tr("pricemap.title", "Price map")}
                fill
                className="object-cover rounded-3xl"
                sizes="100vw"
              />
              <div className="absolute inset-0 grid place-items-center">
                <button
                  type="button"
                  onClick={() => setMobileFullMapOpen(true)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white/95 px-6 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 shadow-md dark:bg-black/80 dark:text-white dark:ring-white/20"
                >
                  <FiMapPin className="h-5 w-5" />
                  {tr("map.viewMap", "View map")}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {groupsToRender.map((group) => (
                (() => {
                  const start = startByCountry[group.country] ?? 0;
                  const showSlider = group.cities.length > visibleCount;
                  const maxStart = Math.max(0, group.cities.length - visibleCount);
                  const canPrev = start > 0;
                  const canNext = start < maxStart;
                  return (
                    <section
                      key={group.country}
                      className="rounded-3xl bg-white p-4 ring-1 ring-slate-200 dark:bg-black dark:ring-white/10"
                    >
                      {!focusedGroup ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`fi fi-${group.regionCode} h-6 w-6`} />
                            <div className={`${recoleta.className} text-2xl text-slate-900 dark:text-white`}>
                              {regionNames.of(group.regionCode.toUpperCase()) || group.country}
                            </div>
                          </div>
                          {showSlider ? (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setStartByCountry((prev) => ({
                                    ...prev,
                                    [group.country]: Math.max(0, (prev[group.country] ?? 0) - 1)
                                  }))
                                }
                                disabled={!canPrev}
                                className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white/10 dark:text-white/80"
                              >
                                <FiChevronLeft />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setStartByCountry((prev) => ({
                                    ...prev,
                                    [group.country]: Math.min(maxStart, (prev[group.country] ?? 0) + 1)
                                  }))
                                }
                                disabled={!canNext}
                                className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white/10 dark:text-white/80"
                              >
                                <FiChevronRight />
                              </button>
                            </div>
                          ) : null}
                        </div>
                      ) : null}

                      <div className="mt-4 overflow-hidden">
                        {!focusedGroup && showSlider ? (
                          <div
                            className="flex transition-transform duration-500 ease-out"
                            style={{ transform: `translateX(-${start * (100 / visibleCount)}%)` }}
                          >
                            {group.cities.map((city) => (
                              <Link
                                key={city.name}
                                href={buildFlightSearchResultsHref(city.name)}
                                className="block shrink-0 px-2 cursor-pointer"
                                style={{ width: `${100 / visibleCount}%` }}
                              >
                                <article className="group min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-black">
                                  <div className="relative h-44">
                                    <Image
                                      src={city.image}
                                      alt={city.name}
                                      fill
                                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                  </div>
                                  <div className="p-4">
                                    <div className="truncate text-base text-slate-900 dark:text-white">
                                      {city.name}
                                    </div>
                                    <div className="mt-1 text-xs text-slate-500 dark:text-white/70">
                                      <span className="inline-flex items-center gap-2">
                                        <BiSolidPlaneAlt className="h-4 w-4" />
                                        {tr("common.from", "from")}{" "}
                                        <span className="font-semibold text-slate-700 dark:text-white">${city.fromPrice}</span>
                                      </span>
                                    </div>
                                  </div>
                                </article>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className={["grid gap-4", mapExpanded ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4"].join(" ")}>
                            {group.cities.map((city) => (
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
                                    />
                                  </div>
                                  <div className="p-4">
                                    <div className="truncate text-base text-slate-900 dark:text-white">
                                      {city.name}
                                    </div>
                                    <div className="mt-1 text-xs text-slate-500 dark:text-white/70">
                                      <span className="inline-flex items-center gap-2">
                                        <BiSolidPlaneAlt className="h-4 w-4" />
                                        {tr("common.from", "from")}{" "}
                                        <span className="font-semibold text-slate-700 dark:text-white">${city.fromPrice}</span>
                                      </span>
                                    </div>
                                  </div>
                                </article>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>

                      {!focusedGroup && showSlider ? (
                        <div className="mt-4 flex justify-center">
                          <button
                            type="button"
                            onClick={() => setFocusedCountry(group.regionCode)}
                            className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-100 px-10 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 dark:bg-white/10 dark:text-white dark:ring-white/15"
                          >
                            <span className={`${recoleta.className} text-sm font-semibold text-slate-900 dark:text-white`}>
                              {tr("map.allCities", "All cities")}
                            </span>
                            <FiChevronRight className="ml-4 h-4 w-4" />
                          </button>
                        </div>
                      ) : null}
                    </section>
                  );
                })()
              ))}
            </div>
          </div>

          <aside
            className={[
              "overflow-visible transition-all duration-500 ease-out hidden md:block",
              mapExpanded ? "lg:w-2/3" : "lg:w-1/3"
            ].join(" ")}
          >
            <div className="sticky top-[170px] h-[calc(100vh-190px)] min-h-[560px]">
              <div
                className={[
                  "relative h-full w-full overflow-hidden rounded-3xl ring-1 ring-slate-200 bg-white dark:bg-black dark:ring-white/10",
                  "transition-[transform,box-shadow] duration-500 ease-out",
                  mapExpanded ? "scale-[1.005] shadow-lg" : "scale-100 shadow-none"
                ].join(" ")}
              >
                <div className="absolute left-4 top-4 z-[1200]">
                  <button
                    type="button"
                    onClick={() => setMapExpanded((v) => !v)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 shadow-md transition hover:bg-slate-50"
                    aria-label={mapExpanded ? tr("map.closeMap", "Close map") : tr("map.openMap", "Open full map")}
                    title={mapExpanded ? tr("map.closeMap", "Close map") : tr("map.openMap", "Open full map")}
                  >
                    {mapExpanded ? <FiMinimize2 className="h-4 w-4" /> : <FiMaximize2 className="h-4 w-4" />}
                  </button>
                </div>

                <div className="relative h-full w-full">
                  <LeafletMap
                    points={mapPoints}
                    refreshKey={`${mapExpanded ? "expanded" : "collapsed"}-${focusedCountry ?? "all"}`}
                    fromLabel={tr("common.from", "from")}
                    onMarkerClick={(p) => openRouteResults(p.name)}
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
        
      </section>
      {isMobileViewport && mobileFullMapOpen ? (
        <div className="fixed inset-0 z-[95] bg-slate-100 dark:bg-black md:hidden">
          <div className="relative h-full w-full">
            <LeafletMap
              points={mapPoints}
              refreshKey={`mobile-full-${focusedCountry ?? "all"}`}
              fromLabel={tr("common.from", "from")}
              onMarkerClick={(p) => openRouteResults(p.name)}
            />
            <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[1400] flex justify-center px-4">
              <button
                type="button"
                onClick={() => setMobileFullMapOpen(false)}
                className="pointer-events-auto inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-md font-semibold text-slate-900 ring-1 ring-slate-200 shadow-md dark:bg-black/85 dark:text-white dark:ring-white/20"
              >
                <FiChevronLeft className="h-5 w-5" />
                {tr("map.backToList", "Back to list")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

