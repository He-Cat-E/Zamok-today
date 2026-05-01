"use client";

import type { DestinationTicket } from "@/lib/siteDestinationData";
import { SITE_PRIMARY_FROM_CITY } from "@/lib/siteDefaults";

type DestinationTicketCardProps = {
  ticket: DestinationTicket;
  /** Origin city shown before the en dash */
  fromCity?: string;
  /** Shown on the right when there are no layover cities (e.g. direct) */
  directLabel?: string;
};

function formatDurationLine(meta: string): string {
  return meta.replace(/\s*·\s*/g, " / ");
}

function formatLayoverCities(text: string | undefined): string | undefined {
  if (!text) return undefined;
  return text.replace(/\s*·\s*/g, ", ");
}

export function DestinationTicketCard({ ticket, fromCity = SITE_PRIMARY_FROM_CITY, directLabel = "Direct" }: DestinationTicketCardProps) {
  const durationLine = formatDurationLine(ticket.durationMeta);
  const layoverLine = formatLayoverCities(ticket.layoverText);

  return (
    <article className="min-w-0 rounded-3xl bg-stone-100 p-4 shadow-sm ring-1 ring-stone-200/70 dark:bg-zinc-800/90 dark:ring-white/10 dark:shadow-none sm:p-5">
      <div className="text-xl font-bold leading-none tracking-tight text-slate-900 dark:text-white sm:text-[22px]">
        ${ticket.price}
      </div>
      <div className="mt-2 text-sm font-semibold leading-snug text-slate-900 dark:text-white">
        {fromCity} – {ticket.toCity}
      </div>

      <div className="mt-4 flex gap-3 border-t border-stone-300/60 pt-4 dark:border-white/10 sm:mt-4 sm:gap-4 sm:pt-4">
        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium text-slate-800 dark:text-white/90">{ticket.dateLabel}</div>
          <div className="mt-0.5 text-[11px] leading-snug text-slate-500 dark:text-white/55 sm:text-xs">{ticket.timeRange}</div>
        </div>
        <div className="min-w-0 flex-1 text-right">
          <div className="text-xs font-medium text-slate-800 dark:text-white/90">{durationLine}</div>
          <div className="mt-0.5 text-[11px] leading-snug text-slate-500 dark:text-white/50 sm:text-xs">
            {layoverLine ?? directLabel}
          </div>
        </div>
      </div>
    </article>
  );
}
