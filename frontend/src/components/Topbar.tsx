"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBed } from "react-icons/fa6";
import { BiSolidPlaneAlt } from "react-icons/bi";
import { BsFillPatchQuestionFill } from "react-icons/bs";
import { FiMoon, FiSun } from "react-icons/fi";
import { LocalePicker } from "@/components/LocalePicker";
import { useT } from "@/i18n/I18nProvider";
import { useTheme } from "@/theme/ThemeProvider";

export function Topbar() {
  const t = useT();
  const pathname = usePathname();
  const { resolved, toggle } = useTheme();
  const isDark = resolved === "dark";
  const [showSearchTabs, setShowSearchTabs] = useState(pathname === "/map");
  const [activeTab, setActiveTab] = useState<"flights" | "hotels">("flights");

  useEffect(() => {
    function onScroll() {
      setShowSearchTabs(pathname === "/map" || window.scrollY > 200);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 h-16 bg-red-600 dark:bg-black">
      <div className="mx-auto grid h-full w-full max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl">
            <Image
              src="/logo.png"
              alt="Zamok Today"
              width={40}
              height={40} 
              className="h-10 w-10 object-cover"
              priority
            />
          </div>
          <div className="hidden leading-tight sm:block">
            <div className="text-lg font-semibold text-white">Zamok Today</div>
          </div>
        </Link>

        <div className="flex justify-center">
          {showSearchTabs ? (
            <div className="inline-flex rounded-2xl border border-white/20 bg-red-700/35 p-1 dark:bg-white/10 dark:border-white/15 hidden md:block">
              <button
                type="button"
                onClick={() => setActiveTab("flights")}
                className={[
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                  activeTab === "flights" ? "bg-white text-slate-900 shadow-sm" : "text-white/90 hover:text-white"
                ].join(" ")}
              >
                <BiSolidPlaneAlt className="h-4 w-4" />
                {t("tabs.flights")}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("hotels")}
                className={[
                  "ml-2 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                  activeTab === "hotels" ? "bg-white text-slate-900 shadow-sm" : "text-white/90 hover:text-white"
                ].join(" ")}
              >
                <FaBed className="h-4 w-4" />
                {t("tabs.hotels")}
              </button>
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-4 text-xs text-white/90">
          <a
            className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-200"
            href="#"
          >
            <BsFillPatchQuestionFill className="h-4 w-4" />
            <span className="hidden sm:inline">{t("topbar.support")}</span>
          </a>
          <LocalePicker />
          <button
            type="button"
            onClick={toggle}
            role="switch"
            aria-checked={isDark}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            className={[
              "group relative inline-flex h-8 w-14 items-center rounded-full p-1",
              "transition-colors duration-200",
              "ring-1 ring-inset",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black",
              // light
              "bg-slate-200 ring-slate-300/80 focus-visible:ring-slate-400",
              // dark (monochrome)
              "dark:bg-white/10 dark:ring-white/15 dark:focus-visible:ring-white/40"
            ].join(" ")}
          >
            {/* track marks */}
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
    </header>
  );
}

