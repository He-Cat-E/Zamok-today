"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiCreditCard, FiLogOut, FiUser } from "react-icons/fi";
import { userInitials } from "@/lib/authApi";
import { useT } from "@/i18n/I18nProvider";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutUser } from "@/store/authSlice";
import { topbarPillClassName } from "@/components/TopbarPill";
import { toast } from "@/lib/toast";

const menuLinkClass =
  "flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-white/5";

export function UserMenu() {
  const t = useT();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
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

  if (!user) return null;

  const initials = userInitials(user);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        className={[topbarPillClassName, "py-1 pl-1 pr-2"].join(" ")}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="relative grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-brand-700 text-xs font-bold text-white ring-2 ring-white/30 dark:bg-zinc-800">
          {user.avatarUrl ? (
            <Image src={user.avatarUrl} alt="" width={32} height={32} className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </span>
        <span className="hidden max-w-[9rem] truncate text-sm font-semibold sm:inline">{user.fullName}</span>
        <FiChevronDown className={`h-4 w-4 shrink-0 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-[70] mt-2 w-56 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-xl dark:border-white/10 dark:bg-zinc-950"
        >
          <div className="border-b border-zinc-100 px-4 py-3 dark:border-white/10">
            <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">{user.fullName}</p>
            <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{user.email}</p>
          </div>
          <Link
            href="/profile"
            role="menuitem"
            className={[menuLinkClass, pathname === "/profile" ? "bg-zinc-50 dark:bg-white/5" : ""].join(" ")}
            onClick={() => setOpen(false)}
          >
            <FiUser className="h-4 w-4 shrink-0" aria-hidden />
            {t("nav.profile")}
          </Link>
          <Link
            href="/wallet"
            role="menuitem"
            className={[menuLinkClass, pathname === "/wallet" ? "bg-zinc-50 dark:bg-white/5" : ""].join(" ")}
            onClick={() => setOpen(false)}
          >
            <FiCreditCard className="h-4 w-4 shrink-0" aria-hidden />
            {t("nav.wallet")}
          </Link>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 border-t border-zinc-100 px-4 py-2.5 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/5"
            onClick={() => {
              setOpen(false);
              void dispatch(logoutUser()).then(() => toast.success(t("toast.auth.logoutSuccess")));
            }}
          >
            <FiLogOut className="h-4 w-4" />
            {t("nav.logout")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
