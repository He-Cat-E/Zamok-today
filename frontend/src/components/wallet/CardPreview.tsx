"use client";

import { FiCreditCard } from "react-icons/fi";
import { digitsOnly } from "@/lib/cardFormat";

export function CardPreview({
  cardNumber,
  holderName,
  expiry,
  className = ""
}: {
  cardNumber: string;
  holderName: string;
  expiry: string;
  className?: string;
}) {
  const digits = digitsOnly(cardNumber);
  const display =
    digits.length === 0
      ? "•••• •••• •••• ••••"
      : digits
          .padEnd(16, "•")
          .slice(0, 16)
          .replace(/(.{4})/g, "$1 ")
          .trim();

  const name = holderName.trim() || "YOUR NAME";
  const exp = expiry.trim() || "MM/YY";

  return (
    <div
      className={[
        "relative aspect-[1.586/1] w-full overflow-hidden rounded-2xl border border-brand-700/40 bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 p-6 text-white shadow-md shadow-brand-900/20 ring-1 ring-brand-500/30",
        className
      ].join(" ")}
      aria-hidden
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-36 w-36 rounded-full bg-brand-500/35 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-4 h-28 w-28 rounded-full bg-brand-400/25 blur-xl" />
      <div className="pointer-events-none absolute right-6 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-brand-300/15 blur-xl" />

      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/25 bg-brand-50/95 shadow-sm">
            <FiCreditCard className="h-5 w-5 text-brand-600" strokeWidth={2} />
          </span>
          <span className="rounded-md bg-brand-800/50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-100">
            Zamok
          </span>
        </div>

        <p className="font-mono text-lg tracking-[0.2em] text-white sm:text-xl">{display}</p>

        <div className="flex items-end justify-between gap-4 border-t border-white/15 pt-4">
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-wider text-brand-100/80">Cardholder</p>
            <p className="truncate text-sm font-semibold uppercase text-white">{name}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[10px] font-medium uppercase tracking-wider text-brand-100/80">Expires</p>
            <p className="font-mono text-sm font-semibold text-white">{exp}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
