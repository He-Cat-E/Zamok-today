"use client";

import Image from "next/image";
import { FiMoon, FiSun } from "react-icons/fi";
import { LocalePicker } from "@/components/LocalePicker";
import { useT } from "@/i18n/I18nProvider";
import { useTheme } from "@/theme/ThemeProvider";

export function Topbar() {
  const t = useT();
  const { resolved, toggle } = useTheme();
  const isDark = resolved === "dark";
  return (
    <header className="sticky top-0 z-20 h-16 bg-red-600 dark:bg-black">
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl">
            <Image
              src={isDark ? "/dark-icon.png" : "/light-icon.png"}
              alt="Zamok Today"
              width={40}
              height={40} 
              className="h-10 w-10 object-cover"
              priority
            />
          </div>
          <div className="leading-tight">
            <div className="text-lg font-semibold text-white">Zamok Today</div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-white/90">
          <a className="hover:text-white" href="#">
            {t("topbar.support")}
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

