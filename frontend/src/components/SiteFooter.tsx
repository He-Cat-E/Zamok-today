"use client";

import Image from "next/image";
import { useT } from "@/i18n/I18nProvider";
import { useTheme } from "@/theme/ThemeProvider";

export function SiteFooter() {
  const t = useT();
  const { resolved } = useTheme();
  const isDark = resolved === "dark";
  return (
    <footer className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-black">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-10">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl">
              <Image
                src={isDark ? "/dark-icon.png" : "/light-icon.png"}
                alt="Zamok Today"
                width={40}
                height={40}
                className="h-10 w-10 object-cover"
              />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">Zamok Today</div>
              <div className="text-xs text-slate-500 dark:text-white/70">© 2007–2026</div>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-sm md:items-center md:text-center">
            <a className="text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white" href="#">
              {t("footer.about")}
            </a>
            <a className="text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white" href="#">
              {t("footer.newsroom")}
            </a>
          </div>

          <div className="md:justify-self-end">
            <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 dark:bg-white/5 p-4 ring-1 ring-slate-200 dark:ring-white/10">
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">{t("footer.getApp")}</div>
                <div className="mt-1 text-xs text-slate-600 dark:text-white/70">{t("footer.priceDrop")}</div>
              </div>
              <div
                className="h-12 w-12 shrink-0 rounded-xl bg-white ring-1 ring-slate-200 grid place-items-center text-[10px] font-semibold text-slate-500"
                aria-label="QR code"
                title="QR code"
              >
                QR
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-[11px] leading-relaxed text-slate-600 dark:text-white/70">
          {t("footer.disclaimer")}
        </div>

        <div className="mt-6">
          <a className="text-xs text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white" href="#">
            {t("footer.privacy")}
          </a>
        </div>
      </div>
    </footer>
  );
}

