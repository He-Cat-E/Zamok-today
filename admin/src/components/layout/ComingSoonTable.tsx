"use client";

import { useT } from "@/i18n/I18nProvider";

type Column = { key: string; labelKey: string };

type ComingSoonTableProps = {
  messageKey: string;
  columns: Column[];
};

export function ComingSoonTable({ messageKey, columns }: ComingSoonTableProps) {
  const t = useT();

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800 sm:px-6">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{t(messageKey)}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/80">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 sm:px-6"
                >
                  {t(col.labelKey)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-16 text-center text-sm font-medium text-zinc-400 dark:text-zinc-500 sm:px-6"
              >
                {t("table.comingSoon")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
