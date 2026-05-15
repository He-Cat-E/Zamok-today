"use client";

import { FiDownload, FiFileText } from "react-icons/fi";
import { useT } from "@/i18n/I18nProvider";

function tr(t: (k: string) => string, key: string, fallback: string) {
  const v = t(key);
  return v === key ? fallback : v;
}

export type InsuranceDocumentRow = {
  titleKey: string;
  href: string;
  fileName: string;
};

type InsuranceDocumentLinksProps = {
  rows: readonly InsuranceDocumentRow[];
  downloadLabelKey: string;
  /** Optional i18n key for the PDF badge (defaults to “PDF”). */
  pdfBadgeKey?: string;
  /** Show a small document icon beside the PDF badge (reference layout). */
  showDocIcon?: boolean;
};

/**
 * Stacked document download rows with full-row hit target, hover lift, and focus ring.
 * Used on DASK and personal accident (and similar) insurance pages.
 */
export function InsuranceDocumentLinks({
  rows,
  downloadLabelKey,
  pdfBadgeKey = "insurance.common.docPdfBadge",
  showDocIcon = true
}: InsuranceDocumentLinksProps) {
  const t = useT();
  const badge = tr(t, pdfBadgeKey, "PDF");
  const downloadLabel = tr(t, downloadLabelKey, "Download");

  return (
    <ul className="mt-10 flex flex-col gap-3 text-left sm:gap-4">
      {rows.map((row) => {
        const title = tr(t, row.titleKey, "");
        const aria = title ? `${downloadLabel}: ${title}` : `${downloadLabel}: ${row.fileName}`;
        return (
          <li key={row.titleKey}>
            <a
              href={row.href}
              download={row.fileName}
              aria-label={aria}
              className="group relative flex flex-wrap items-center justify-between gap-4 overflow-hidden rounded-2xl border border-zinc-200/90 bg-zinc-50/90 px-4 py-4 shadow-sm ring-zinc-900/5 transition duration-200 ease-out hover:-translate-y-0.5 hover:border-brand-200/90 hover:bg-white hover:shadow-md hover:shadow-zinc-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/55 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-zinc-950/90 dark:ring-white/5 dark:hover:border-brand-400/35 dark:hover:bg-zinc-950 dark:hover:shadow-black/50 dark:focus-visible:ring-offset-zinc-950 sm:px-5 sm:py-4 md:gap-6"
            >
              <span className="pointer-events-none absolute inset-x-0 top-0 h-0.5 scale-x-0 bg-gradient-to-r from-brand-500/0 via-brand-500/80 to-brand-500/0 opacity-0 transition duration-300 group-hover:scale-x-100 group-hover:opacity-100" aria-hidden />
              <span className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                {showDocIcon ? (
                  <span
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-zinc-200/90 bg-white text-zinc-500 shadow-sm transition-colors duration-200 group-hover:border-brand-200/80 group-hover:text-brand-600 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400 dark:group-hover:border-brand-400/40 dark:group-hover:text-brand-400"
                    aria-hidden
                  >
                    <FiFileText className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                ) : null}
                <span className="shrink-0 rounded-md bg-brand-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-brand-800 shadow-sm transition-colors duration-200 group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-950/60 dark:text-brand-100 dark:group-hover:bg-brand-500 dark:group-hover:text-white">
                  {badge}
                </span>
                <span className="min-w-0 text-sm font-medium leading-snug text-zinc-800 transition-colors group-hover:text-zinc-950 dark:text-zinc-100 dark:group-hover:text-white md:text-base">
                  {title}
                </span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-zinc-100/90 px-3 py-2 text-sm font-semibold text-brand-600 transition-all duration-200 group-hover:bg-brand-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-brand-900/20 dark:bg-zinc-800/90 dark:text-brand-400 dark:group-hover:bg-brand-500 dark:group-hover:text-white">
                <FiDownload className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-px group-hover:scale-110" aria-hidden />
                <span>{downloadLabel}</span>
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
