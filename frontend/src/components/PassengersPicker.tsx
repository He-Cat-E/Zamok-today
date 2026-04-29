"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiCheckCircle, FiCircle, FiMinus, FiPlus, FiX } from "react-icons/fi";

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
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [mounted, setMounted] = useState(false);
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
    setMounted(true);
    function syncViewport() {
      setIsMobileViewport(window.innerWidth < 768);
    }
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onPointerDown(e: MouseEvent) {
      if (isMobileViewport) return;
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
  }, [isMobileViewport]);

  useEffect(() => {
    if (!open || !isMobileViewport) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open, isMobileViewport]);

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
                ? "bg-red-100 text-red-300 ring-red-200 cursor-not-allowed"
                : "bg-red-600 text-white ring-red-600 hover:bg-red-700"
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
        className="w-full text-left truncate"
      >
        <div className="text-sm font-semibold truncate mt-1 md:mt-0 text-slate-900 dark:text-white">{labelTop}</div>
        <div className="text-sm hidden md:block text-slate-500 dark:text-white/60">{cabinLabel}</div>
      </button>

      {open ? (
        <>
        <div className="absolute -right-4 top-[calc(100%+20px)] z-50 hidden w-[440px] rounded-3xl bg-white p-4 shadow-2xl ring-1 ring-black/10 dark:bg-black dark:ring-white/15 md:block">
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
                    <FiCheckCircle className="h-5 w-5 text-red-600" />
                  ) : (
                    <FiCircle className="h-5 w-5 text-slate-300 dark:text-white/25" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
        {mounted && isMobileViewport ? createPortal(
          <div className="fixed inset-0 z-[85] bg-slate-100 dark:bg-[#0f0f0f] md:hidden">
            <div className="flex items-center justify-center border-b border-slate-300 bg-slate-100 px-4 py-4 dark:border-white/10 dark:bg-[#111111]">
              <div className="text-2xl font-semibold text-slate-900 dark:text-white">Passengers and class</div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-4 top-3.5 grid h-9 w-9 place-items-center rounded-full text-slate-500 hover:bg-slate-200 dark:text-white/70 dark:hover:bg-white/10"
                aria-label="Close passengers"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <div className="h-[calc(100vh-84px)] overflow-y-auto px-5 pb-32 pt-4">
              <div className="divide-y divide-slate-200 dark:divide-white/10">
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
                  subtitle="2-11 years old"
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

              <div className="mt-6 divide-y divide-slate-200 dark:divide-white/10">
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
                        <FiCheckCircle className="h-6 w-6 text-red-600" />
                      ) : (
                        <FiCircle className="h-6 w-6 text-slate-300 dark:text-white/25" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="fixed inset-x-0 bottom-0 z-[86] border-t border-slate-200 bg-slate-100 px-6 pb-6 pt-4 dark:border-white/10 dark:bg-[#0f0f0f]">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full rounded-2xl bg-red-600 py-3 text-xl font-semibold text-white hover:bg-red-700"
              >
                Ok
              </button>
            </div>
          </div>,
          document.body
        ) : null}
        </>
      ) : null}
    </div>
  );
}

