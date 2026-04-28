"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FiCheckCircle, FiCircle, FiMinus, FiPlus } from "react-icons/fi";

export type CabinValue = "economy" | "premium" | "business" | "first";

type Props = {
  value: { adults: number; children: number; infants: number; cabin: CabinValue };
  onChange: (next: { adults: number; children: number; infants: number; cabin: CabinValue }) => void;
};

function cn(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

export function PassengersPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const total = value.adults + value.children + value.infants;
  const labelTop = `${total} passenger${total === 1 ? "" : "s"}`;
  const cabinLabel =
    value.cabin === "economy"
      ? "Economy"
      : value.cabin === "premium"
        ? "Comfort"
        : value.cabin === "business"
          ? "Business"
          : "First";

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onPointerDown(e: MouseEvent) {
      const el = rootRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, []);

  const canInc = useMemo(() => total < 9, [total]);

  function setCounts(next: Partial<{ adults: number; children: number; infants: number }>) {
    const adults = Math.max(1, next.adults ?? value.adults);
    const children = Math.max(0, next.children ?? value.children);
    const infants = Math.max(0, next.infants ?? value.infants);
    // keep within max 9
    const sum = adults + children + infants;
    if (sum > 9) return;
    onChange({ ...value, adults, children, infants });
  }

  function CounterRow({
    title,
    subtitle,
    count,
    onDec,
    onInc,
    decDisabled,
    incDisabled
  }: {
    title: string;
    subtitle: string;
    count: number;
    onDec: () => void;
    onInc: () => void;
    decDisabled?: boolean;
    incDisabled?: boolean;
  }) {
    return (
      <div className="flex items-center justify-between gap-4 py-3">
        <div>
          <div className="text-sm font-semibold text-slate-900 dark:text-white">{title}</div>
          <div className="text-xs text-slate-500 dark:text-white/60">{subtitle}</div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onDec}
            disabled={decDisabled}
            className={cn(
              "grid h-9 w-9 place-items-center rounded-full ring-1 transition",
              decDisabled
                ? "bg-slate-100 text-slate-300 ring-slate-200 cursor-not-allowed"
                : "bg-slate-100 text-slate-600 ring-slate-200 hover:bg-slate-200",
              "dark:bg-white/10 dark:ring-white/15 dark:hover:bg-white/15"
            )}
            aria-label={`Decrease ${title}`}
          >
            <FiMinus className="h-4 w-4" />
          </button>
          <div className="w-7 text-center text-base font-semibold text-slate-900 dark:text-white">
            {count}
          </div>
          <button
            type="button"
            onClick={onInc}
            disabled={incDisabled}
            className={cn(
              "grid h-9 w-9 place-items-center rounded-full ring-1 transition",
              incDisabled
                ? "bg-blue-100 text-blue-300 ring-blue-200 cursor-not-allowed"
                : "bg-blue-600 text-white ring-blue-600 hover:bg-blue-700"
            )}
            aria-label={`Increase ${title}`}
          >
            <FiPlus className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left"
      >
        <div className="text-sm font-semibold text-slate-900 dark:text-white">{labelTop}</div>
        <div className="text-sm text-slate-500 dark:text-white/60">{cabinLabel}</div>
      </button>

      {open ? (
        <div className="absolute -right-4 top-[calc(100%+20px)] z-50 w-[440px] rounded-3xl bg-white p-4 shadow-2xl ring-1 ring-black/10 dark:bg-black dark:ring-white/15">
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            Number of passengers
          </div>

          <div className="mt-4 divide-y divide-slate-200 dark:divide-white/10">
            <CounterRow
              title="Adults"
              subtitle="12 years and older"
              count={value.adults}
              onDec={() => setCounts({ adults: value.adults - 1 })}
              onInc={() => setCounts({ adults: value.adults + 1 })}
              decDisabled={value.adults <= 1}
              incDisabled={!canInc}
            />
            <CounterRow
              title="Children"
              subtitle="2–11 years old"
              count={value.children}
              onDec={() => setCounts({ children: value.children - 1 })}
              onInc={() => setCounts({ children: value.children + 1 })}
              decDisabled={value.children <= 0}
              incDisabled={!canInc}
            />
            <CounterRow
              title="Infants"
              subtitle="Under 2 y.o., on lap"
              count={value.infants}
              onDec={() => setCounts({ infants: value.infants - 1 })}
              onInc={() => setCounts({ infants: value.infants + 1 })}
              decDisabled={value.infants <= 0}
              incDisabled={!canInc}
            />
          </div>

          <div className="mt-6 text-xl font-bold text-slate-900 dark:text-white">Class</div>
          <div className="mt-3 divide-y divide-slate-200 dark:divide-white/10">
            {(
              [
                { value: "economy", label: "Economy" },
                { value: "premium", label: "Comfort" },
                { value: "business", label: "Business" },
                { value: "first", label: "First" }
              ] as const
            ).map((c) => {
              const selected = value.cabin === c.value;
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => onChange({ ...value, cabin: c.value })}
                  className="flex w-full items-center justify-between py-3 text-left"
                >
                  <div className="text-base text-slate-900 dark:text-white">{c.label}</div>
                  {selected ? (
                    <FiCheckCircle className="h-5 w-5 text-blue-600" />
                  ) : (
                    <FiCircle className="h-5 w-5 text-slate-300 dark:text-white/25" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

