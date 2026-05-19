"use client";

import { AdminPageHeader } from "@/components/layout/AdminPageHeader";
import { ComingSoonTable } from "@/components/layout/ComingSoonTable";
import { useT } from "@/i18n/I18nProvider";

const COLUMNS = [
  { key: "id", labelKey: "table.id" },
  { key: "name", labelKey: "table.name" },
  { key: "status", labelKey: "table.status" },
  { key: "actions", labelKey: "table.actions" }
] as const;

export default function RolesPage() {
  const t = useT();

  return (
    <>
      <AdminPageHeader title={t("page.roles.title")} subtitle={t("page.roles.subtitle")} />
      <ComingSoonTable messageKey="page.roles.placeholder" columns={[...COLUMNS]} />
    </>
  );
}
