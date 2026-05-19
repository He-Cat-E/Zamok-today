"use client";

import { AdminPageHeader } from "@/components/layout/AdminPageHeader";
import { AdminProfileSettings } from "@/components/profile/AdminProfileSettings";
import { useT } from "@/i18n/I18nProvider";

export default function AdminProfilePage() {
  const t = useT();

  return (
    <div className="flex w-full min-w-0 flex-col">
      <AdminPageHeader title={t("page.profile.title")} subtitle={t("page.profile.subtitle")} />
      <AdminProfileSettings />
    </div>
  );
}
