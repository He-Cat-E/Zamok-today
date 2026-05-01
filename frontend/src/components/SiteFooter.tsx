"use client";

import Image from "next/image";
import Link from "next/link";
import { useT } from "@/i18n/I18nProvider";
import { useTheme } from "@/theme/ThemeProvider";
import { recoleta } from "@/theme/fonts";

export function SiteFooter() {
  const t = useT();
  const { resolved } = useTheme();
  const isDark = resolved === "dark";
  return (
    <footer className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-black">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-10">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-3">
          <Link href="/" className="flex items-center justify-center gap-3 md:justify-start">
            <div className="relative h-18 w-18 overflow-hidden rounded-xl">
              <Image
                src={isDark ? "/logo.png" : "/icon.jfif"}
                alt="Zamok Today"
                width={72}
                height={72}
                className="h-18 w-18 object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <div className={`${recoleta.className} text-2xl font-semibold text-slate-900 dark:text-white`}>Zamok Today</div>
              <div className="text-2xs text-slate-500 dark:text-white/70">© 2007–2026</div>
            </div>
          </Link>

          <div className="flex flex-col items-center gap-2 text-center text-sm">
            <a className="text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white" href="#">
              {t("footer.about")}
            </a>
            <a className="text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white" href="#">
              {t("footer.newsroom")}
            </a>
          </div>

          <div className="md:justify-self-end">
            <div className="flex items-center justify-center gap-4 rounded-2xl bg-slate-50 dark:bg-white/5 p-4 ring-1 ring-slate-200 dark:ring-white/10">
              <div className="text-center md:text-left">
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
        <div className="mt-6 text-center md:text-left">
          <a className="text-xs text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white" href="#">
            {t("footer.privacy")}
          </a>
        </div>
      </div>
    </footer>
  );
}

