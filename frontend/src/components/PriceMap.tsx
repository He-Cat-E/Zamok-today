"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useT } from "@/i18n/I18nProvider";
import { BiSolidPlaneAlt } from "react-icons/bi";
import { FiChevronRight, FiInfo, FiX } from "react-icons/fi";
import { useTheme } from "@/theme/ThemeProvider";
import { recoleta } from "@/theme/fonts";

export function PriceMap() {
  const t = useT();
  const { resolved } = useTheme();
  const isDark = resolved === "dark";
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const howRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!howItWorksOpen) return;
    howRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [howItWorksOpen]);

  return (
    <div className="space-y-5">
      <section className="rounded-3xl bg-white dark:bg-black p-6 shadow-sm ring-1 ring-slate-200 dark:ring-white/10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-center">
          <div className="flex flex-col gap-3 md:gap-4 h-full justify-between">
            <div>
              <div className={`${recoleta.className} text-3xl font-semibold text-slate-900 dark:text-white`}>{t("pricemap.title")}</div>
              <div className="mt-1 text-sm text-slate-500 dark:text-white/70">{t("pricemap.subtitle")}</div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                className="inline-flex h-12 w-full max-w-[360px] items-center justify-center rounded-2xl bg-slate-100 px-6 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:ring-white/15 dark:hover:bg-white/15"
              >
                {t("pricemap.open")}
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200 dark:bg-black dark:ring-white/10">
            <div className="relative w-full h-[280px]">
              <Image
                src={isDark ? "/Images/dark-map.png" : "/Images/light-map.png"}
                alt={t("pricemap.title")}
                fill
                priority={false}
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />              
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white dark:bg-black p-6 shadow-sm ring-1 ring-slate-200 dark:ring-white/10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-white/80">
            <FiInfo className="h-4 w-4 text-slate-400 dark:text-white/40" />
            <span>{t("pricemap.caption")}</span>
          </div>
          <button
            type="button"
            onClick={() => setHowItWorksOpen((v) => !v)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 dark:text-white dark:hover:text-white/85"
            aria-expanded={howItWorksOpen}
            aria-controls="pricemap-how-it-works"
          >
            {t("pricemap.howItWorks")}
            <FiChevronRight className={["h-4 w-4 transition", howItWorksOpen ? "rotate-90" : ""].join(" ")} />
          </button>
        </div>

        <div
          id="pricemap-how-it-works"
          ref={howRef}
          className={[
            "overflow-hidden transition-[max-height,opacity,transform] duration-300",
            howItWorksOpen ? "max-h-[240px] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-1"
          ].join(" ")}
        >
          <div className="mt-4 bg-white px-6 py-5 ring-1 ring-slate-200 dark:bg-black dark:ring-white/10">
            <div className="text-base font-bold text-slate-900 dark:text-white">
              {t("pricemap.howItWorksTitle")}
            </div>
            <div className="mt-3 text-sm text-slate-700 dark:text-white/70">{t("pricemap.howItWorksBody")}</div>
          </div>
        </div>
      </section>
    </div>
  );
}

