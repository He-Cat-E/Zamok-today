"use client";

import { AdminPageHeader } from "@/components/layout/AdminPageHeader";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useT } from "@/i18n/I18nProvider";

export default function DashboardPage() {
  const t = useT();
  const { admin } = useAdminAuth();

  return (
    <>
      <AdminPageHeader
        title={t("page.dashboard.title")}
        subtitle={
          admin?.fullName
            ? `${t("page.dashboard.welcome")}, ${admin.fullName}. ${t("page.dashboard.subtitle")}`
            : t("page.dashboard.subtitle")
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            {t("page.dashboard.role")}
          </p>
          <p className="mt-2 text-lg font-semibold capitalize text-zinc-900 dark:text-white">
            {admin?.role?.replace("_", " ") ?? "—"}
          </p>
        </article>
        <article className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            {t("page.dashboard.account")}
          </p>
          <p className="mt-2 truncate text-sm font-medium text-zinc-900 dark:text-white">
            {admin?.email ?? "—"}
          </p>
        </article>
        <article className="rounded-2xl border border-brand-200 bg-brand-50/80 p-5 dark:border-brand-800 dark:bg-brand-950/50 sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-800 dark:text-brand-200">
            {t("page.dashboard.status")}
          </p>
          <p className="mt-2 text-lg font-semibold text-brand-900 dark:text-brand-100">
            {t("page.dashboard.active")}
          </p>
        </article>
      </div>
    </>
  );
}
