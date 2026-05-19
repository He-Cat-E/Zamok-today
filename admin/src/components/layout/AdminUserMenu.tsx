"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiLogOut, FiUser } from "react-icons/fi";
import { dropdownItem, dropdownPanel, topbarIconBtn } from "@/components/layout/layoutUi";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { adminInitials } from "@/lib/adminInitials";
import { useT } from "@/i18n/I18nProvider";

export function AdminUserMenu() {
  const t = useT();
  const pathname = usePathname();
  const { admin, logout } = useAdminAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!admin) return null;

  const initials = adminInitials(admin);
  const label = admin.fullName?.trim() || admin.email;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={[
          topbarIconBtn,
          "text-xs font-bold",
          open ? "ring-2 ring-brand-500/50" : ""
        ].join(" ")}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={label}
      >
        <span className="text-brand-700 dark:text-brand-300">{initials}</span>
      </button>

      {open ? (
        <div role="menu" className={`${dropdownPanel} w-56`}>
          <div className="border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
            <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
              {admin.fullName || admin.email}
            </p>
            <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{admin.email}</p>
          </div>
          <Link
            href="/profile"
            role="menuitem"
            className={[
              dropdownItem,
              pathname === "/profile" ? "bg-zinc-50 dark:bg-zinc-800" : ""
            ].join(" ")}
            onClick={() => setOpen(false)}
          >
            <FiUser className="h-4 w-4 shrink-0" aria-hidden />
            {t("topbar.profile")}
          </Link>
          <button
            type="button"
            role="menuitem"
            className={`${dropdownItem} border-t border-zinc-100 dark:border-zinc-800`}
            onClick={() => {
              setOpen(false);
              void logout().then(() => window.location.assign("/login"));
            }}
          >
            <FiLogOut className="h-4 w-4 shrink-0" aria-hidden />
            {t("topbar.logout")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
