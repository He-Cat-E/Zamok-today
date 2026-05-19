"use client";

import { AdminPageHeader } from "@/components/layout/AdminPageHeader";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useT } from "@/i18n/I18nProvider";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900 sm:px-5 sm:py-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-white">{value || "—"}</p>
    </div>
  );
}

export default function AdminProfilePage() {
  const t = useT();
  const { admin } = useAdminAuth();

  return (
    <>
      <AdminPageHeader title={t("page.profile.title")} subtitle={t("page.profile.subtitle")} />
      <div className="grid max-w-2xl gap-3 sm:grid-cols-2">
        <Field label={t("page.profile.fullName")} value={admin?.fullName ?? ""} />
        <Field label={t("login.email")} value={admin?.email ?? ""} />
        <Field
          label={t("page.dashboard.role")}
          value={admin?.role?.replace("_", " ") ?? ""}
        />
        <Field label={t("page.dashboard.status")} value={t("page.dashboard.active")} />
      </div>
    </>
  );
}
