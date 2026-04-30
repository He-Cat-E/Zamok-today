"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type Props = {
  value?: string; // YYYY-MM-DD
  minYmd?: string; // YYYY-MM-DD
  rangeStartYmd?: string;
  rangeEndYmd?: string;
  onChange: (ymd: string) => void;
  onClose: () => void;
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function ymdFromDate(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function dateFromYmd(ymd: string) {
  const [y, m, d] = ymd.split("-").map((x) => Number(x));
  if (!y || !m || !d) return null;
  const dt = new Date(y, m - 1, d);
  if (Number.isNaN(dt.getTime())) return null;
  return dt;
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addMonths(d: Date, months: number) {
  return new Date(d.getFullYear(), d.getMonth() + months, 1);
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatMonthTitle(d: Date) {
  return d.toLocaleString(undefined, { month: "long", year: "numeric" });
}

function getMonthGrid(month: Date) {
  const first = startOfMonth(month);
  const startDow = first.getDay(); // 0..6
  const start = new Date(first);
  start.setDate(first.getDate() - startDow);

  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

function cn(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

function MonthView({
  month,
  selected,
  rangeStart,
  rangeEnd,
  minDate,
  onSelect
}: {
  month: Date;
  selected: Date | null;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  minDate: Date;
  onSelect: (d: Date) => void;
}) {
  const days = useMemo(() => getMonthGrid(month), [month]);
  const monthIndex = month.getMonth();

  const weekDays = useMemo(() => {
    const base = new Date(2024, 0, 7); // Sunday
    return Array.from({ length: 7 }).map((_, i) =>
      new Date(base.getFullYear(), base.getMonth(), base.getDate() + i).toLocaleString(
        undefined,
        { weekday: "short" }
      )
    );
  }, []);

  return (
    <div className="w-[360px]">
      <div className="grid grid-cols-7 gap-1 px-1 pb-2 text-xs text-slate-500">
        {weekDays.map((w) => (
          <div key={w} className="text-center">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 px-1">
        {days.map((d) => {
          const isOutside = d.getMonth() !== monthIndex;
          const isSelected = selected ? sameDay(selected, d) : false;
          const isDisabled = startOfDay(d).getTime() < minDate.getTime();
          const dayTime = startOfDay(d).getTime();
          const rangeStartTime = rangeStart ? startOfDay(rangeStart).getTime() : null;
          const rangeEndTime = rangeEnd ? startOfDay(rangeEnd).getTime() : null;
          const hasRange = rangeStartTime !== null && rangeEndTime !== null && rangeEndTime >= rangeStartTime;
          const isRangeStart = rangeStart ? sameDay(rangeStart, d) : false;
          const isRangeEnd = rangeEnd ? sameDay(rangeEnd, d) : false;
          const inRange =
            hasRange && rangeStartTime !== null && rangeEndTime !== null && dayTime > rangeStartTime && dayTime < rangeEndTime;
          if (isOutside) {
            return <div key={d.toISOString()} className="h-11 rounded-xl" aria-hidden="true" />;
          }
          return (
            <button
              key={d.toISOString()}
              type="button"
              onClick={() => onSelect(d)}
              disabled={isDisabled}
              className={cn(
                "h-11 rounded-xl text-sm transition",
                isDisabled
                  ? "text-slate-300 cursor-not-allowed dark:text-white/35"
                  : "text-slate-900 hover:bg-slate-50 dark:text-white dark:hover:bg-white/10",
                inRange ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200" : "",
                isRangeStart ? "bg-red-600 text-white hover:bg-red-600" : "",
                isRangeEnd ? "bg-red-600 text-white hover:bg-red-600" : "",
                !isRangeStart && !isRangeEnd && isSelected ? "bg-red-600 text-white hover:bg-red-600" : ""
              )}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TwoMonthDatePicker({ value, minYmd, rangeStartYmd, rangeEndYmd, onChange, onClose }: Props) {
  const selected = useMemo(() => (value ? dateFromYmd(value) : null), [value]);
  const rangeStart = useMemo(() => (rangeStartYmd ? dateFromYmd(rangeStartYmd) : null), [rangeStartYmd]);
  const rangeEnd = useMemo(() => (rangeEndYmd ? dateFromYmd(rangeEndYmd) : null), [rangeEndYmd]);
  const minDate = useMemo(() => {
    const base = minYmd ? dateFromYmd(minYmd) : null;
    if (base) return startOfDay(base);
    return startOfDay(new Date());
  }, [minYmd]);
  const initialMonth = useMemo(() => {
    if (selected) return startOfMonth(selected);
    return startOfMonth(new Date());
  }, [selected]);

  const [leftMonth, setLeftMonth] = useState<Date>(initialMonth);

  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    function onPointerDown(e: MouseEvent) {
      const panel = panelRef.current;
      if (!panel) return;
      if (e.target instanceof Node && !panel.contains(e.target)) onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [onClose]);

  const rightMonth = useMemo(() => addMonths(leftMonth, 1), [leftMonth]);

  const content = (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" aria-hidden="true" />

      <div
        ref={panelRef}
        className="relative w-full max-w-[820px] rounded-3xl bg-white p-4 shadow-2xl ring-1 ring-black/10 dark:bg-black dark:ring-white/15"
      >
        <div className="flex items-center justify-between px-2 pb-3">
        <button
          type="button"
          onClick={() => setLeftMonth((m) => addMonths(m, -1))}
          className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/15"
          aria-label="Previous month"
        >
          <FiChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-14">
          <div className="text-lg font-semibold text-slate-900 dark:text-white">{formatMonthTitle(leftMonth)}</div>
          <div className="text-lg font-semibold text-slate-900 dark:text-white">{formatMonthTitle(rightMonth)}</div>
        </div>

        <button
          type="button"
          onClick={() => setLeftMonth((m) => addMonths(m, 1))}
          className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/15"
          aria-label="Next month"
        >
          <FiChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="flex gap-6">
        <MonthView
          month={leftMonth}
          selected={selected}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          minDate={minDate}
          onSelect={(d) => {
            onChange(ymdFromDate(d));
          }}
        />
        <MonthView
          month={rightMonth}
          selected={selected}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          minDate={minDate}
          onSelect={(d) => {
            onChange(ymdFromDate(d));
          }}
        />
      </div>

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={() => {
            onClose();
          }}
          className="rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700"
        >
          Select for one-way trip
        </button>
      </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(content, document.body);
}

