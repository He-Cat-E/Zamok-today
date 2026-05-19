"use client";

import { AdminPageHeader } from "@/components/layout/AdminPageHeader";
import { ComingSoonTable } from "@/components/layout/ComingSoonTable";
import { useT } from "@/i18n/I18nProvider";

const COLUMNS = [
  { key: "id", labelKey: "table.id" },
  { key: "email", labelKey: "table.email" },
  { key: "amount", labelKey: "table.amount" },
  { key: "date", labelKey: "table.date" },
  { key: "status", labelKey: "table.status" }
] as const;

export default function TransactionsPage() {
  const t = useT();

  return (
    <>
      <AdminPageHeader
        title={t("page.transactions.title")}
        subtitle={t("page.transactions.subtitle")}
      />
      <ComingSoonTable messageKey="page.transactions.placeholder" columns={[...COLUMNS]} />
    </>
  );
}
