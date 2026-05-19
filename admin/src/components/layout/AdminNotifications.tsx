"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FiBell } from "react-icons/fi";
import { dropdownPanel, topbarIconBtn } from "@/components/layout/layoutUi";
import { useT } from "@/i18n/I18nProvider";

type AdminNotification = {
  id: string;
  titleKey: string;
  bodyKey: string;
  timeKey: string;
  unread: boolean;
};

const INITIAL: AdminNotification[] = [
  {
    id: "1",
    titleKey: "notifications.demo1Title",
    bodyKey: "notifications.demo1Body",
    timeKey: "notifications.time2h",
    unread: true
  },
  {
    id: "2",
    titleKey: "notifications.demo2Title",
    bodyKey: "notifications.demo2Body",
    timeKey: "notifications.time1d",
    unread: true
  }
];

export function AdminNotifications() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AdminNotification[]>(INITIAL);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = useMemo(() => items.filter((n) => n.unread).length, [items]);

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

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

  function markRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={[topbarIconBtn, "relative", open ? "ring-2 ring-brand-500/40" : ""].join(" ")}
        aria-expanded={open}
        aria-label={t("topbar.notifications")}
      >
        <FiBell className="h-[1.125rem] w-[1.125rem]" aria-hidden />
        {unreadCount > 0 ? (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold leading-none text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className={`${dropdownPanel} w-80 sm:w-[22rem]`}>
          <div className="flex items-center justify-between gap-2 border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">{t("notifications.title")}</p>
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
              >
                {t("notifications.markAllRead")}
              </button>
            ) : null}
          </div>

          {items.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
              {t("notifications.empty")}
            </p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {items.map((n) => (
                <li key={n.id} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => markRead(n.id)}
                    className={[
                      "w-full px-4 py-3 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/80",
                      n.unread ? "bg-brand-50/50 dark:bg-brand-950/20" : ""
                    ].join(" ")}
                  >
                    <div className="flex items-start gap-2">
                      {n.unread ? (
                        <span
                          className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-600"
                          aria-hidden
                        />
                      ) : (
                        <span className="mt-1.5 h-2 w-2 shrink-0" aria-hidden />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-zinc-900 dark:text-white">
                          {t(n.titleKey)}
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                          {t(n.bodyKey)}
                        </span>
                        <span className="mt-1 block text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                          {t(n.timeKey)}
                        </span>
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
