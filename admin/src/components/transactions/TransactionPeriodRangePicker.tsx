"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
  addMonths,
  formatMonthYear,
  formatYmdDisplay,
  isDayInRange,
  isRangeEndpoint,
  monthGrid,
  normalizeRangeSelection,
  parseYmd,
  startOfMonth,
  toYmd,
  type DateRangeValue
} from "@/lib/dateRange";
import { useI18n } from "@/i18n/I18nProvider";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

type Labels = {
  period: string;
  placeholder: string;
  apply: string;
  clear: string;
  close: string;
};

type Props = {
  value: DateRangeValue;
  onChange: (next: DateRangeValue) => void;
  onApply: () => void;
  onClear: () => void;
  labels: Labels;
  hasAppliedFilter: boolean;
};

function MonthPanel({
  month,
  from,
  to,
  locale,
  onDayClick
}: {
  month: Date;
  from: string;
  to: string;
  locale: string;
  onDayClick: (ymd: string) => void;
}) {
  const monthIndex = month.getMonth();
  const days = useMemo(() => monthGrid(month), [month]);

  return (
    <div className="zt-range-month">
      <p className="zt-range-month-title">{formatMonthYear(month, locale)}</p>
      <div className="zt-range-weekdays" aria-hidden>
        {WEEKDAYS.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>
      <div className="zt-range-days">
        {days.map((day) => {
          const inMonth = day.getMonth() === monthIndex;
          if (!inMonth) {
            return <span key={day.toISOString()} className="zt-range-day zt-range-day--empty" aria-hidden />;
          }
          const ymd = toYmd(day);
          const endpoint = isRangeEndpoint(day, from, to);
          const inRange = isDayInRange(day, from, to);
          return (
            <button
              key={day.toISOString()}
              type="button"
              className={[
                "zt-range-day",
                endpoint ? "zt-range-day--endpoint" : "",
                inRange ? "zt-range-day--in-range" : ""
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => onDayClick(ymd)}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TransactionPeriodRangePicker({
  value,
  onChange,
  onApply,
  onClear,
  labels,
  hasAppliedFilter
}: Props) {
  const { lang } = useI18n();
  const locale = lang === "en" ? undefined : lang;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [leftMonth, setLeftMonth] = useState(() => {
    const anchor = parseYmd(value.from) || parseYmd(value.to) || new Date();
    return startOfMonth(anchor);
  });

  const rightMonth = useMemo(() => addMonths(leftMonth, 1), [leftMonth]);

  const triggerLabel = useMemo(() => {
    const { from, to } = value;
    if (!from && !to) return labels.placeholder;
    if (from && to) {
      return `${formatYmdDisplay(from, locale)} — ${formatYmdDisplay(to, locale)}`;
    }
    if (from) return formatYmdDisplay(from, locale);
    return formatYmdDisplay(to, locale);
  }, [value, labels.placeholder, locale]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    const anchor = parseYmd(value.from) || parseYmd(value.to);
    if (anchor) setLeftMonth(startOfMonth(anchor));
  }, [value.from, value.to]);

  function onDayClick(ymd: string) {
    onChange(normalizeRangeSelection(value.from, value.to, ymd));
  }

  function handleApply() {
    setOpen(false);
    onApply();
  }

  return (
    <div ref={rootRef} className="zt-range-picker">
      <button
        type="button"
        className="zt-range-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <FiCalendar className="zt-range-trigger-icon" aria-hidden />
        <span className={value.from || value.to ? "zt-range-trigger-text" : "zt-range-trigger-placeholder"}>
          {triggerLabel}
        </span>
      </button>

      {open ? (
        <div className="zt-range-popover" role="dialog" aria-label={labels.period}>
          <div className="zt-range-nav">
            <button
              type="button"
              className="zt-range-nav-btn"
              onClick={() => setLeftMonth((m) => addMonths(m, -1))}
              aria-label="Previous month"
            >
              <FiChevronLeft size={18} />
            </button>
            <div className="zt-range-calendars">
              <MonthPanel
                month={leftMonth}
                from={value.from}
                to={value.to}
                locale={lang}
                onDayClick={onDayClick}
              />
              <MonthPanel
                month={rightMonth}
                from={value.from}
                to={value.to}
                locale={lang}
                onDayClick={onDayClick}
              />
            </div>
            <button
              type="button"
              className="zt-range-nav-btn"
              onClick={() => setLeftMonth((m) => addMonths(m, 1))}
              aria-label="Next month"
            >
              <FiChevronRight size={18} />
            </button>
          </div>

          <div className="zt-range-footer">
            <button type="button" className="zt-range-apply-btn" onClick={handleApply}>
              {labels.apply}
            </button>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        className="zt-tx-period-btn zt-tx-period-btn--ghost"
        onClick={onClear}
        disabled={!hasAppliedFilter && !value.from && !value.to}
      >
        {labels.clear}
      </button>
    </div>
  );
}
