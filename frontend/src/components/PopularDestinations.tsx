"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useT } from "@/i18n/I18nProvider";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { BiSolidPlaneAlt } from "react-icons/bi";
import { getPopularDestinationCards, type PopularDestinationCard } from "@/lib/siteDestinationData";
import { recoleta } from "@/theme/fonts";

const destinations = getPopularDestinationCards();

export function PopularDestinations() {
  const t = useT();
  const [start, setStart] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [allOpen, setAllOpen] = useState(false);

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

  function DestinationCard({ d }: { d: PopularDestinationCard }) {
    return (
      <Link
        href={`/destinations/${d.slug}`}
        className="block h-full rounded-2xl outline-none ring-red-600/0 transition hover:ring-2 focus-visible:ring-2 focus-visible:ring-red-600"
      >
        <article className="group h-full overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black">
          <div className="relative h-44">
            <Image
              src={d.image}
              alt={d.country}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
            <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100 dark:bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.12),transparent_55%)]" />
          </div>
          <div className="p-4">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">{d.country}</div>
            <div className="mt-1 text-xs text-slate-500 dark:text-white/70">
              <span className="inline-flex items-center gap-2">
                <BiSolidPlaneAlt className="h-4 w-4" /> {t("common.from")}{" "}
                <span className="font-semibold text-slate-700 dark:text-white">${d.fromPrice}</span>
              </span>
            </div>
          </div>
        </article>
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
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${start * (100 / visibleCount)}%)` }}
          >
            {destinations.map((d) => (
              <div
                key={d.country}
                className="shrink-0 px-2"
                style={{ width: `${100 / visibleCount}%` }}
              >
                <DestinationCard d={d} />
              </div>
            ))}
          </div>
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
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/35 p-0 md:p-4"
          onClick={() => setAllOpen(false)}
        >
          <div
            className="h-full w-full max-h-[100vh] overflow-y-auto rounded-none bg-white p-4 shadow-2xl ring-0 dark:bg-black md:max-h-[88vh] md:max-w-[1100px] md:rounded-3xl md:p-6 md:ring-1 md:ring-slate-200 md:dark:ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 mb-4 flex items-center justify-between bg-white dark:bg-black pb-2">
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {destinations.map((d) => (
                <DestinationCard key={`modal-${d.country}`} d={d} />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

