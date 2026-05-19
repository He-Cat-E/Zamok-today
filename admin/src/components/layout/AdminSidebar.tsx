"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiChevronLeft, FiChevronRight, FiLogOut } from "react-icons/fi";
import { sidebarNavActive, sidebarNavIdle, sidebarNavItem } from "@/components/layout/layoutUi";
import { filterNavForAdmin } from "@/config/adminPages";
import { ADMIN_NAV_ITEMS } from "@/config/nav";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useAdminLayout } from "@/context/AdminLayoutContext";
import { useT } from "@/i18n/I18nProvider";

const sidebarToggleBtn =
  "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100";

export function AdminSidebar() {
  const t = useT();
  const pathname = usePathname();
  const { admin, logout } = useAdminAuth();
  const { sidebarCollapsed, toggleSidebar } = useAdminLayout();

  const brandTitle = `${t("sidebar.brandLine")} ${t("sidebar.brandSub")}`;
  const navItems = filterNavForAdmin(ADMIN_NAV_ITEMS, admin);

  return (
    <aside
      className={[
        "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-zinc-200 bg-white transition-[width] duration-300 ease-in-out dark:border-zinc-800 dark:bg-zinc-950",
        sidebarCollapsed ? "w-[4.25rem]" : "w-[17rem]"
      ].join(" ")}
    >
      <div
        className={[
          "flex shrink-0 items-start gap-1 border-b border-zinc-200 dark:border-zinc-800",
          sidebarCollapsed ? "flex-col items-center px-2 py-3" : "px-3 py-3"
        ].join(" ")}
      >
        <Link
          href="/dashboard"
          className={[
            "min-w-0 flex-1 text-zinc-900 dark:text-white",
            sidebarCollapsed ? "text-center" : ""
          ].join(" ")}
          title={brandTitle}
        >
          {sidebarCollapsed ? (
            <span className="text-[11px] font-bold leading-none tracking-tight text-brand-600 dark:text-brand-400">
              
            </span>
          ) : (
            <>
              <p className="truncate text-lg font-bold leading-snug tracking-tight">
                {t("sidebar.brandLine")}
              </p>
              <p className="mt-0.5 truncate text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {t("sidebar.brandSub")}
              </p>
            </>
          )}
        </Link>
        <button
          type="button"
          onClick={toggleSidebar}
          className={sidebarToggleBtn}
          aria-label={sidebarCollapsed ? t("nav.expand") : t("nav.collapse")}
          title={sidebarCollapsed ? t("nav.expand") : t("nav.collapse")}
        >
          {sidebarCollapsed ? (
            <FiChevronRight className="h-5 w-5" />
          ) : (
            <FiChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {!sidebarCollapsed ? (
        <p className="px-4 pb-1 pt-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          {t("nav.section")}
        </p>
      ) : null}

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-2">
        {navItems.map(({ href, labelKey, icon: Icon }) => {
          const active =
            pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));
          return (
            <Link
              key={href}
              href={href}
              title={sidebarCollapsed ? t(labelKey) : undefined}
              className={[
                sidebarNavItem,
                active ? sidebarNavActive : sidebarNavIdle,
                sidebarCollapsed ? "justify-center px-2" : ""
              ].join(" ")}
            >
              <Icon className="h-[1.125rem] w-[1.125rem] shrink-0" aria-hidden />
              {!sidebarCollapsed ? <span className="truncate">{t(labelKey)}</span> : null}
            </Link>
          );
        })}
      </nav>

      {admin ? (
        <div className="border-t border-zinc-200 p-2 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => void logout().then(() => window.location.assign("/login"))}
            className={[
              sidebarNavItem,
              "w-full text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/80",
              sidebarCollapsed ? "justify-center px-2" : "justify-start"
            ].join(" ")}
            title={sidebarCollapsed ? t("topbar.logout") : undefined}
          >
            <FiLogOut className="h-[1.125rem] w-[1.125rem] shrink-0" aria-hidden />
            {!sidebarCollapsed ? <span className="truncate">{t("topbar.logout")}</span> : null}
          </button>
        </div>
      ) : null}
    </aside>
  );
}
