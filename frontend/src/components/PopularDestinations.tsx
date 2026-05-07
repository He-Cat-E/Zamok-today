"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT } from "@/i18n/I18nProvider";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { BiSolidPlaneAlt } from "react-icons/bi";
import { env } from "@/lib/env";
import { getPopularDestinationCards } from "@/lib/siteDestinationData";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setFlightSearchForm } from "@/store/flightsSlice";
import { recoleta } from "@/theme/fonts";

const staticDestinations = getPopularDestinationCards();
const BLANK_DESTINATION_IMAGE = "/Images/blank.webp";

type DestinationCardView = {
  countryCode: string;
  country: string;
  fromPrice: number;
  destinationIata?: string;
  image?: string;
  slug?: string;
};

function slugifyCountryName(value: string): string {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type PopularDestinationsApiResponse = {
  originCountry?: string;
  currency?: string;
  destinations?: Array<{
    countryCode: string;
    fromPrice: number;
    destinationIata: string;
    destinationCity: string;
  }>;
};

function formatPriceByCurrency(amount: number, currencyCode: string): string {
  const normalized = String(currencyCode || "USD")
    .trim()
    .toUpperCase();
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: normalized,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0
    }).format(amount);
  } catch {
    return `${normalized} ${Math.round(amount)}`;
  }
}

function cityImageFromIata(iata?: string): string | undefined {
  const code = String(iata || "")
    .trim()
    .toUpperCase();
  if (!/^[A-Z]{3}$/.test(code)) return undefined;
  return `https://img.avs.io/explore/cities/${code}`;
}

export function PopularDestinations() {
  const t = useT();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const countryCode = useAppSelector((s) => s.locale.country);
  const currencyCode = useAppSelector((s) => s.locale.currency);
  const originIata = useAppSelector((s) => s.locale.originIata);
  const selectedFromIata = useAppSelector((s) => s.flights.searchForm.fromIata);
  const [destinations, setDestinations] = useState<DestinationCardView[]>([]);
  const [start, setStart] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [allOpen, setAllOpen] = useState(false);
  const [isLoadedSuccessfully, setIsLoadedSuccessfully] = useState(false);
  const latestRequestIdRef = useRef(0);

  useEffect(() => {
    function updateVisibleCount() {
      const w = window.innerWidth;
      if (w >= 1024) setVisibleCount(4);
      else if (w >= 640) setVisibleCount(2);
      else setVisibleCount(1);
    }
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const maxStart = Math.max(0, destinations.length - visibleCount);

  useEffect(() => {
    if (start > maxStart) setStart(maxStart);
  }, [maxStart, start]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setAllOpen(false);
    }
    if (allOpen) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [allOpen]);

  useEffect(() => {
    if (pathname !== "/") return;
    const originCountry = String(countryCode || "TR")
      .trim()
      .toUpperCase();
    if (!/^[A-Z]{2}$/.test(originCountry)) return;

    const url = new URL(`${env.apiBaseUrl}/api/flights/popular-destinations`);
    url.searchParams.set("originCountry", originCountry);
    const effectiveFromIata = String(selectedFromIata || originIata || "")
      .trim()
      .toUpperCase();
    if (/^[A-Z]{3}$/.test(effectiveFromIata)) {
      url.searchParams.set("originIata", effectiveFromIata);
    }
    if (currencyCode) {
      url.searchParams.set("currency", String(currencyCode).toLowerCase());
    }

    const requestId = latestRequestIdRef.current + 1;
    latestRequestIdRef.current = requestId;
    const controller = new AbortController();

    setIsLoadedSuccessfully(false);
    void fetch(url.toString(), { cache: "no-store", signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(`popular destinations failed (${res.status})`);
        return (await res.json()) as PopularDestinationsApiResponse;
      })
      .then((apiData) => {
        if (requestId !== latestRequestIdRef.current) return;
        const apiDestinations = Array.isArray(apiData?.destinations) ? apiData.destinations : [];
        if (!apiDestinations.length) {
          setDestinations([]);
          return;
        }

        const staticByCode = new Map(staticDestinations.map((d) => [d.slug.toUpperCase(), d]));
        const countryNames = new Intl.DisplayNames(["en"], { type: "region" });
        const rankedFromApi: DestinationCardView[] = [];
        for (const row of apiDestinations) {
          const code = String(row?.countryCode || "")
            .trim()
            .toUpperCase();
          if (!/^[A-Z]{2}$/.test(code)) continue;
          const match = staticByCode.get(code);
          rankedFromApi.push({
            countryCode: code,
            country: match?.country || countryNames.of(code) || code,
            fromPrice: Number(row.fromPrice) || match?.fromPrice || 0,
            destinationIata: String(row?.destinationIata || "")
              .trim()
              .toUpperCase(),
            image: cityImageFromIata(row?.destinationIata),
            slug: slugifyCountryName(match?.country || countryNames.of(code) || code)
          });
          if (match) staticByCode.delete(code);
        }

        setDestinations(rankedFromApi);
        setIsLoadedSuccessfully(true);
        setStart(0);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        if (requestId !== latestRequestIdRef.current) return;
        // Ignore stale/aborted request errors.
        if (err instanceof Error && err.name === "AbortError") return;
        setDestinations([]);
        setIsLoadedSuccessfully(false);
      });

    return () => {
      controller.abort();
    };
  }, [countryCode, currencyCode, originIata, pathname, selectedFromIata]);

  function DestinationCard({ d }: { d: DestinationCardView }) {
    const [imageSrc, setImageSrc] = useState<string | undefined>(d.image);
    const formattedPrice = formatPriceByCurrency(d.fromPrice, currencyCode);

    useEffect(() => {
      setImageSrc(d.image);
    }, [d.image]);

    const cardContent = (
      <article className="group h-full overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black">
        <div className="relative h-44">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={d.destinationIata ? `${d.country} (${d.destinationIata})` : d.country}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              onError={() => {
                if (imageSrc !== BLANK_DESTINATION_IMAGE) {
                  setImageSrc(BLANK_DESTINATION_IMAGE);
                }
              }}
            />
          ) : (
            <Image
              src={BLANK_DESTINATION_IMAGE}
              alt={d.destinationIata ? `${d.country} (${d.destinationIata})` : d.country}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          )}
          <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100 dark:bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.12),transparent_55%)]" />
        </div>
        <div className="p-4">
          <div className="text-sm font-semibold text-slate-900 dark:text-white">{d.country}</div>
          <div className="mt-1 text-xs text-slate-500 dark:text-white/70">
            <span className="inline-flex items-center gap-2">
              <BiSolidPlaneAlt className="h-4 w-4" /> {t("common.from")}{" "}
              <span className="font-semibold text-slate-700 dark:text-white">{formattedPrice}</span>
            </span>
          </div>
        </div>
      </article>
    );

    if (!d.slug) {
      return <div className="block h-full rounded-2xl">{cardContent}</div>;
    }

    return (
      <Link
        href={`/destinations/${d.slug}?rc=${d.countryCode.toLowerCase()}`}
        onClick={() =>
          dispatch(
            setFlightSearchForm({
              to: d.country
            })
          )
        }
        className="block h-full rounded-2xl outline-none ring-red-600/0 transition hover:ring-2 focus-visible:ring-2 focus-visible:ring-red-600"
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <>
      <section className="rounded-3xl bg-white dark:bg-black p-6 shadow-sm ring-1 ring-slate-200 dark:ring-white/10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className={`${recoleta.className} text-3xl font-semibold text-slate-900 dark:text-white`}>{t("popular.title")}</div>
            <div className="mt-1 text-sm text-slate-500 dark:text-white/70">{t("popular.subtitle")}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStart((s) => Math.max(0, s - 1))}
              disabled={start === 0}
              className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 dark:border-white/15 text-slate-600 dark:text-white/80 hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous"
            >
              <FiChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setStart((s) => Math.min(maxStart, s + 1))}
              disabled={start >= maxStart}
              className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 dark:border-white/15 text-slate-600 dark:text-white/80 hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next"
            >
              <FiChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-5 overflow-hidden">
          {!isLoadedSuccessfully ? (
            <div className="flex">
              {Array.from({ length: visibleCount }).map((_, i) => (
                <div key={`skeleton-${i}`} className="shrink-0 px-2" style={{ width: `${100 / visibleCount}%` }}>
                  <article className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-black">
                    <div className="h-44 animate-pulse bg-slate-200 dark:bg-white/10" />
                    <div className="space-y-2 p-4">
                      <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-white/10" />
                      <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-white/10" />
                    </div>
                  </article>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${start * (100 / visibleCount)}%)` }}
            >
              {destinations.map((d) => (
                <div
                  key={`${d.countryCode}-${d.slug || "api"}`}
                  className="shrink-0 px-2"
                  style={{ width: `${100 / visibleCount}%` }}
                >
                  <DestinationCard d={d} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setAllOpen(true)}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/10 px-6 text-sm font-semibold text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-white/15 ring-1 ring-slate-200 dark:ring-white/15"
          >
            {t("popular.all")}
          </button>
        </div>
      </section>

      {allOpen ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-0 md:p-4"
          onClick={() => setAllOpen(false)}
        >
          <div
            className="flex h-full w-full max-h-[100dvh] flex-col overflow-hidden rounded-none bg-white p-4 shadow-2xl ring-0 dark:bg-black md:max-h-[88dvh] md:max-w-[1100px] md:rounded-3xl md:p-6 md:ring-1 md:ring-slate-200 md:dark:ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-20 mb-4 flex shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 pb-3 backdrop-blur dark:border-white/10 dark:bg-black/95">
              <div className={`${recoleta.className} text-3xl font-semibold text-slate-900 dark:text-white`}>
                {t("popular.title")}
              </div>
              <button
                type="button"
                onClick={() => setAllOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 dark:border-white/15 text-slate-600 dark:text-white/80 hover:bg-slate-50 dark:hover:bg-white/5"
                aria-label="Close"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-1 gap-4 pb-2 sm:grid-cols-2 lg:grid-cols-3">
              {!isLoadedSuccessfully
                ? Array.from({ length: 6 }).map((_, i) => (
                    <article
                      key={`modal-skeleton-${i}`}
                      className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-black"
                    >
                      <div className="h-44 animate-pulse bg-slate-200 dark:bg-white/10" />
                      <div className="space-y-2 p-4">
                        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-white/10" />
                        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-white/10" />
                      </div>
                    </article>
                  ))
                : destinations.map((d) => (
                    <DestinationCard key={`modal-${d.countryCode}-${d.slug || "api"}`} d={d} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

