"use client";

import { FiMenu } from "react-icons/fi";
import { AdminLanguagePicker } from "@/components/layout/AdminLanguagePicker";
import { AdminNotifications } from "@/components/layout/AdminNotifications";
import { AdminUserMenu } from "@/components/layout/AdminUserMenu";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { topbarIconBtn } from "@/components/layout/layoutUi";
import { useAdminLayout } from "@/context/AdminLayoutContext";
import { useT } from "@/i18n/I18nProvider";

export function AdminTopbar() {
  const t = useT();
  const { toggleSidebar } = useAdminLayout();

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-950 sm:px-6">
      <button
        type="button"
        onClick={toggleSidebar}
        className={`${topbarIconBtn} lg:hidden`}
        aria-label={t("nav.expand")}
      >
        <FiMenu className="h-5 w-5" />
      </button>
      <div className="hidden flex-1 lg:block" />
      <div className="flex flex-1 items-center justify-end gap-2 lg:flex-none">
        <ThemeToggle />
        <AdminLanguagePicker />
        <AdminNotifications />
        <AdminUserMenu />
      </div>
    </header>
  );
}
