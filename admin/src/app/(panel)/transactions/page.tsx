"use client";

import dynamic from "next/dynamic";
import { AdminPageHeader } from "@/components/layout/AdminPageHeader";
import { useT } from "@/i18n/I18nProvider";

const TransactionsDataTable = dynamic(
  () =>
    import("@/components/transactions/TransactionsDataTable").then((m) => m.TransactionsDataTable),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-16 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        …
      </div>
    )
  }
);

export default function TransactionsPage() {
  const t = useT();

  return (
    <>
      <AdminPageHeader
        title={t("page.transactions.title")}
        subtitle={t("page.transactions.subtitle")}
      />
      <TransactionsDataTable />
    </>
  );
}
