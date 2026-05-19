"use client";

import { AdminPageHeader } from "@/components/layout/AdminPageHeader";
import { ComingSoonTable } from "@/components/layout/ComingSoonTable";
import { useT } from "@/i18n/I18nProvider";

const COLUMNS = [
  { key: "id", labelKey: "table.id" },
  { key: "email", labelKey: "table.email" },
  { key: "name", labelKey: "table.name" },
  { key: "status", labelKey: "table.status" },
  { key: "actions", labelKey: "table.actions" }
] as const;

export default function AdminsPage() {
  const t = useT();

  return (
    <>
      <AdminPageHeader title={t("page.admins.title")} subtitle={t("page.admins.subtitle")} />
      <ComingSoonTable messageKey="page.admins.placeholder" columns={[...COLUMNS]} />
    </>
  );
}
