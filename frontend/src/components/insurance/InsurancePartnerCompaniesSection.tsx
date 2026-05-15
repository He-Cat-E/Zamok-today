"use client";

import Image from "next/image";
import { useT } from "@/i18n/I18nProvider";
import { recoleta } from "@/theme/fonts";

function tr(t: (k: string) => string, key: string, fallback: string) {
  const v = t(key);
  return v === key ? fallback : v;
}

const PARTNERS = [
  { src: "/companies/hepiui-logo.svg", nameKey: "insurance.partner.hepIyi", label: "Hepiyi Sigorta" },
  { src: "/companies/mapfre-sigorta.png", nameKey: "insurance.partner.mapfre", label: "Mapfre Sigorta" },
  { src: "/companies/sompo-logo.svg", nameKey: "insurance.partner.sompo", label: "Sompo Japan Sigorta" },
  { src: "/companies/doga-logo.svg", nameKey: "insurance.partner.doga", label: "Doğa Sigorta" },
  { src: "/companies/quick-sigorta-blue-logo.svg", nameKey: "insurance.partner.quick", label: "Quick Sigorta" }
] as const;

/** Partner insurer logos — shared across all insurance landing pages. */
export function InsurancePartnerCompaniesSection() {
  const t = useT();

  return (
    <section
      className="border-b border-zinc-200/90 bg-zinc-100 py-14 transition-colors duration-300 dark:border-white/10 dark:bg-black"
      aria-labelledby="insurance-partners-heading"
    >
      <div className="mx-auto max-w-[1440px] px-4">
        <h2
          id="insurance-partners-heading"
          className={`${recoleta.className} text-center text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}
        >
          {tr(t, "insurance.partnersTitle", "Insurers we work with")}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-base">
          {tr(
            t,
            "insurance.partnersSubtitle",
            "We compare products from leading Turkish insurers so you can see clear options and our best available deals."
          )}
        </p>
        <ul className="mt-10 grid list-none grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5" role="list">
          {PARTNERS.map((p) => (
            <li key={p.src}>
              <div className="flex min-h-[148px] flex-col items-center justify-between gap-4 rounded-2xl border border-zinc-200/90 bg-white p-5 text-center shadow-sm insurance-hover-card dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/40">
                <div className="relative flex h-16 w-full max-w-[168px] shrink-0 items-center justify-center">
                  <Image
                    src={p.src}
                    alt=""
                    width={168}
                    height={64}
                    className="max-h-16 w-auto object-contain"
                    sizes="(max-width: 640px) 45vw, 168px"
                  />
                </div>
                <p className="text-xs font-medium leading-tight text-zinc-800 dark:text-zinc-200 sm:text-sm">
                  {tr(t, p.nameKey, p.label)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
