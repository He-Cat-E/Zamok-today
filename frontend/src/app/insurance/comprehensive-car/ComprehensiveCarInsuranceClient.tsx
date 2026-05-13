"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import { Topbar } from "@/components/Topbar";
import { InsuranceScrollMain } from "@/components/insurance/InsuranceScrollMain";
import { InsurancePartnerCompaniesSection } from "@/components/insurance/InsurancePartnerCompaniesSection";
import { SiteFooter } from "@/components/SiteFooter";
import { useT } from "@/i18n/I18nProvider";
import { recoleta } from "@/theme/fonts";

function tr(t: (k: string) => string, key: string, fallback: string) {
  const v = t(key);
  return v === key ? fallback : v;
}

const COVER_ITEMS = [
  "insurance.comprehensive.coverItem1",
  "insurance.comprehensive.coverItem2",
  "insurance.comprehensive.coverItem3",
  "insurance.comprehensive.coverItem4",
  "insurance.comprehensive.coverItem5",
  "insurance.comprehensive.coverItem6",
  "insurance.comprehensive.coverItem7",
  "insurance.comprehensive.coverItem8"
] as const;

const WHY_KEYS = [
  "insurance.comprehensive.why1",
  "insurance.comprehensive.why2",
  "insurance.comprehensive.why3",
  "insurance.comprehensive.why4",
  "insurance.comprehensive.why5"
] as const;

/** Feature rows: label key + Mini / Limited / Extended / Full cell keys */
const COMPARE_ROWS: Array<{ label: string; cells: [string, string, string, string] }> = [
  {
    label: "insurance.comprehensive.cmpRowTraffic",
    cells: [
      "insurance.comprehensive.cmpMiniTraffic",
      "insurance.comprehensive.cmpLimitedTraffic",
      "insurance.comprehensive.cmpExtendedTraffic",
      "insurance.comprehensive.cmpFullTraffic"
    ]
  },
  {
    label: "insurance.comprehensive.cmpRowFire",
    cells: [
      "insurance.comprehensive.cmpMiniFire",
      "insurance.comprehensive.cmpLimitedFire",
      "insurance.comprehensive.cmpExtendedFire",
      "insurance.comprehensive.cmpFullFire"
    ]
  },
  {
    label: "insurance.comprehensive.cmpRowTheft",
    cells: [
      "insurance.comprehensive.cmpMiniTheft",
      "insurance.comprehensive.cmpLimitedTheft",
      "insurance.comprehensive.cmpExtendedTheft",
      "insurance.comprehensive.cmpFullTheft"
    ]
  },
  {
    label: "insurance.comprehensive.cmpRowGlass",
    cells: [
      "insurance.comprehensive.cmpMiniGlass",
      "insurance.comprehensive.cmpLimitedGlass",
      "insurance.comprehensive.cmpExtendedGlass",
      "insurance.comprehensive.cmpFullGlass"
    ]
  }
];

const MOCK_PREMIUM_ROWS = [
  { month: "insurance.comprehensive.tableM1", price: "insurance.comprehensive.tableP1" },
  { month: "insurance.comprehensive.tableM2", price: "insurance.comprehensive.tableP2" },
  { month: "insurance.comprehensive.tableM3", price: "insurance.comprehensive.tableP3" },
  { month: "insurance.comprehensive.tableM4", price: "insurance.comprehensive.tableP4" }
];

const HERO_OVERVIEW_IMAGE = "/Images/Comprehensive_Car_Insurance.png";

const EXPERT_SLIDE_INTERVAL_MS = 6500;

const EXPERT_REVIEWS = [
  {
    image: "/Images/reviews/man-1.jpg",
    quoteKey: "insurance.comprehensive.expertSlide1Quote",
    nameKey: "insurance.comprehensive.expertSlide1Name",
    roleKey: "insurance.comprehensive.expertSlide1Role"
  },
  {
    image: "/Images/reviews/man-2.jpg",
    quoteKey: "insurance.comprehensive.expertSlide2Quote",
    nameKey: "insurance.comprehensive.expertSlide2Name",
    roleKey: "insurance.comprehensive.expertSlide2Role"
  },
  {
    image: "/Images/reviews/man-3.jpg",
    quoteKey: "insurance.comprehensive.expertSlide3Quote",
    nameKey: "insurance.comprehensive.expertSlide3Name",
    roleKey: "insurance.comprehensive.expertSlide3Role"
  }
] as const;

const EXPERT_FALLBACKS: ReadonlyArray<{ quote: string; name: string; role: string }> = [
  {
    quote:
      "Comprehensive cover is about matching the policy to how you use the car — not paying for extras you do not need. Start with your driving pattern, then layer optional protections.",
    name: "Mehmet Yılmaz",
    role: "Motor underwriting — İlsa Insurance"
  },
  {
    quote:
      "Deductibles and approved repair networks matter as much as the headline premium — compare like for like before you bind cover.",
    name: "Ayşe Demir",
    role: "Customer advisory — İlsa Insurance"
  },
  {
    quote:
      "At renewal, revisit mileage, where you park, and any accessories — small changes often mean your cover should change too.",
    name: "Can Öztürk",
    role: "Renewals specialist — İlsa Insurance"
  }
];

function ExpertReviewsCarousel() {
  const t = useT();
  const [active, setActive] = useState(0);
  const [motionOk, setMotionOk] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotionOk(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!motionOk) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % EXPERT_REVIEWS.length);
    }, EXPERT_SLIDE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [motionOk]);

  const slide = EXPERT_REVIEWS[active];
  const fb = EXPERT_FALLBACKS[active];

  return (
    <section className="border-y border-zinc-200/90 bg-zinc-100 py-14 transition-colors duration-300 dark:border-white/10 dark:bg-black">
      <div className="mx-auto max-w-[800px] px-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-zinc-400">
          {tr(t, "insurance.comprehensive.expertLabel", "Our expert says")}
        </p>

        <div className="relative mt-6 min-h-[11rem] md:min-h-[9.5rem]" aria-live="polite">
          <blockquote
            key={active}
            className="text-lg leading-relaxed text-zinc-800 motion-safe:animate-expertFadeIn dark:text-zinc-100 motion-reduce:animate-none"
          >
            “{tr(t, slide.quoteKey, fb.quote)}”
          </blockquote>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3">
          <div
            key={`av-${active}`}
            className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-zinc-200 shadow-md ring-2 ring-red-200/90 motion-safe:animate-expertFadeIn dark:bg-zinc-900 dark:ring-white/25 motion-reduce:animate-none"
          >
            <Image
              src={slide.image}
              alt=""
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="text-center motion-safe:animate-expertFadeIn motion-reduce:animate-none" key={`meta-${active}`}>
            <div className="font-bold text-zinc-900 dark:text-white">{tr(t, slide.nameKey, fb.name)}</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">{tr(t, slide.roleKey, fb.role)}</div>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-2" role="tablist" aria-label="Expert reviews">
          {EXPERT_REVIEWS.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Expert review ${i + 1}`}
              className={[
                "h-2.5 rounded-full transition-all duration-300",
                i === active ? "w-8 bg-red-600 dark:bg-zinc-100" : "w-2.5 bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-600 dark:hover:bg-zinc-500"
              ].join(" ")}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ComprehensiveCarInsuranceClient() {
  const t = useT();

  return (
    <div className="flex min-h-dvh flex-col bg-zinc-50 text-zinc-900 transition-colors duration-300 selection:bg-red-200 selection:text-red-950 dark:bg-black dark:text-zinc-50 dark:selection:bg-zinc-700 dark:selection:text-zinc-100">
      <Topbar />

      <InsuranceScrollMain>
        {/* Hero — brand red in light; solid black in dark */}
        <section className="relative overflow-hidden bg-red-600 dark:bg-black">
          <div className="relative mx-auto grid max-w-[1440px] gap-10 px-4 py-12 lg:grid-cols-2 lg:items-center lg:py-16">
            <div className="text-white">
              <nav className="mb-4 text-sm text-white/85 dark:text-white/80" aria-label="Breadcrumb">
                <ol className="flex flex-wrap gap-2">
                  <li>
                    <Link href="/" className="hover:text-white hover:underline">
                      {tr(t, "destination.backHome", "Home")}
                    </Link>
                  </li>
                  <li aria-hidden>/</li>
                  <li>
                    <span>{tr(t, "nav.insurance", "Insurance")}</span>
                  </li>
                  <li aria-hidden>/</li>
                  <li className="font-semibold text-white">{tr(t, "insurance.comprehensive.breadcrumbCurrent", "Comprehensive car insurance")}</li>
                </ol>
              </nav>
              <h1 className={`${recoleta.className} text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl`}>
                {tr(t, "insurance.comprehensive.heroTitle", "Comprehensive car insurance")}
              </h1>
              <p className="mt-3 text-lg text-white/95 md:text-xl">
                {tr(t, "insurance.comprehensive.heroSubtitle", "Secure your vehicle in all situations.")}
              </p>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/90 md:text-base">
                {tr(
                  t,
                  "insurance.comprehensive.introP1",
                  "Comprehensive car insurance is an optional type of insurance that protects your vehicle against unexpected risks."
                )}
              </p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/90 md:text-base">
                {tr(
                  t,
                  "insurance.comprehensive.introP2",
                  "At İlsa Insurance, we help you determine the most suitable comprehensive car insurance package for your needs."
                )}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#contact-quote"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-red-700 shadow-lg shadow-red-900/15 ring-1 ring-white/20 transition hover:bg-red-50 hover:shadow-xl dark:bg-zinc-100 dark:text-zinc-950 dark:shadow-black/40 dark:ring-white/15 dark:hover:bg-white"
                >
                  {tr(t, "insurance.comprehensive.ctaPrimary", "Get a quote")}
                  <FiArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact-quote"
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/90 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-[2px] transition hover:bg-white/15 dark:border-white/70 dark:bg-white/5 dark:hover:border-white dark:hover:bg-white/10"
                >
                  {tr(t, "insurance.comprehensive.ctaSecondary", "Talk to an advisor")}
                  <FiArrowRight className="h-4 w-4" />
                </a>
              </div>
              <p className="mt-8 text-xs text-white/70 dark:text-white/60">{tr(t, "insurance.comprehensive.mockDisclaimer", "Illustrative page — contact İlsa Insurance for binding quotes.")}</p>
            </div>
            <div className="relative mx-auto flex w-full max-w-xl justify-center lg:mx-0 lg:max-w-none lg:justify-end">
              <div className="relative aspect-[4/3] w-full max-w-[520px] overflow-hidden rounded-3xl bg-white/10 shadow-2xl shadow-black/20 ring-4 ring-white/25 dark:bg-zinc-900/40 dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.75)] dark:ring-white/10 lg:max-w-[600px]">
                <Image
                  src={HERO_OVERVIEW_IMAGE}
                  alt={tr(t, "insurance.comprehensive.heroTitle", "Comprehensive car insurance")}
                  fill
                  className="object-cover object-center dark:brightness-[0.92] dark:contrast-[1.05]"
                  sizes="(max-width: 1024px) 100vw, 600px"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="border-b border-zinc-200/90 bg-white py-14 transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950">
          <div className="mx-auto max-w-[1440px] px-4">
            <h2 className={`${recoleta.className} text-center text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.comprehensive.stepsTitle", "Compare comprehensive cover in minutes")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-zinc-600 dark:text-zinc-300">
              {tr(t, "insurance.comprehensive.stepsLead", "Three simple steps to tailor your quote.")}
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                { n: 1, title: "insurance.comprehensive.step1Title", body: "insurance.comprehensive.step1Body" },
                { n: 2, title: "insurance.comprehensive.step2Title", body: "insurance.comprehensive.step2Body" },
                { n: 3, title: "insurance.comprehensive.step3Title", body: "insurance.comprehensive.step3Body" }
              ].map((s) => (
                <div
                  key={s.n}
                  className="flex flex-col items-center rounded-3xl border border-zinc-200/90 bg-zinc-50/90 p-6 text-center shadow-sm shadow-zinc-900/5 insurance-hover-card transition-colors duration-300 dark:border-white/10 dark:bg-zinc-900/60 dark:shadow-black/40"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-zinc-400 bg-white text-xl font-bold tabular-nums text-zinc-900 shadow-sm dark:border-zinc-500 dark:bg-zinc-950 dark:text-white md:h-14 md:w-14 md:text-2xl">
                    {s.n}
                  </div>
                  <h3
                    className={`${recoleta.className} mt-5 text-xl font-semibold leading-snug tracking-tight text-zinc-900 dark:text-white md:text-2xl`}
                  >
                    {tr(t, s.title, "")}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 md:max-w-none md:text-base">
                    {tr(t, s.body, "")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why İlsa */}
        <section className="bg-zinc-100 py-14 transition-colors duration-300 dark:bg-zinc-950">

          <div className="mx-auto max-w-[1440px] px-4">
            <h2 className={`${recoleta.className} text-center text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.comprehensive.whyTitle", "Why choose İlsa Insurance?")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-zinc-600 dark:text-zinc-300">
              {tr(t, "insurance.comprehensive.whyLead", "Reliable protection with human support in Ankara.")}
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {WHY_KEYS.map((key) => (
                <div
                  key={key}
                  className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-200/90 bg-white p-4 text-center shadow-sm shadow-zinc-900/5 insurance-hover-card transition-colors duration-300 dark:border-white/10 dark:bg-black dark:shadow-black/50"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-red-600 text-white shadow-sm shadow-red-900/20 dark:bg-zinc-950 dark:shadow-black/50 dark:ring-1 dark:ring-white/15">
                    <FiCheck className="h-5 w-5" />
                  </span>
                  <p className="text-sm font-medium leading-snug text-zinc-800 dark:text-zinc-100">{tr(t, key, "")}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing explainer + mock table */}
        <section className="border-b border-zinc-200/90 bg-white py-14 transition-colors duration-300 dark:border-white/10 dark:bg-black">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-4 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 className={`${recoleta.className} text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
                {tr(t, "insurance.comprehensive.pricingTitle", "How are car insurance prices determined?")}
              </h2>
              <p className="mt-4 text-zinc-600 dark:text-zinc-300">{tr(t, "insurance.comprehensive.pricingBody", "")}</p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-sm insurance-hover-card transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950">
              <p className="border-b border-zinc-200/80 bg-zinc-100 px-4 py-3 text-sm font-bold text-zinc-900 dark:border-white/10 dark:bg-zinc-900 dark:text-white">
                {tr(t, "insurance.comprehensive.tableAvgTitle", "Illustrative average premiums")}
              </p>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200/80 bg-zinc-50 dark:border-white/10 dark:bg-zinc-900/80">
                    <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                      {tr(t, "insurance.comprehensive.tableColPeriod", "Period")}
                    </th>
                    <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                      {tr(t, "insurance.comprehensive.tableColAvg", "Indicative premium")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_PREMIUM_ROWS.map((row, i) => (
                    <tr
                      key={row.month}
                      className={[
                        "border-b border-zinc-100 transition-colors dark:border-white/10",
                        i % 2 === 1 ? "bg-zinc-50/70 dark:bg-white/[0.03]" : "bg-white dark:bg-transparent"
                      ].join(" ")}
                    >
                      <td className="px-4 py-3 text-zinc-700 dark:text-zinc-200">{tr(t, row.month, "")}</td>
                      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">{tr(t, row.price, "")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="border-t border-zinc-100 bg-zinc-50/50 px-4 py-3 text-xs text-zinc-500 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-400">
                {tr(t, "insurance.comprehensive.tableFootnote", "")}
              </p>
            </div>
          </div>
        </section>

        {/* Types */}
        <section className="bg-zinc-50 py-14 transition-colors duration-300 dark:bg-zinc-950">
          <div className="mx-auto max-w-[1440px] px-4">
            <h2 className={`${recoleta.className} text-center text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.comprehensive.typesSectionTitle", "Types of car insurance")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-zinc-600 dark:text-zinc-300">
              {tr(t, "insurance.comprehensive.typesSectionLead", "Different insurance options are available to suit your needs.")}
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {[
                { title: "insurance.comprehensive.typeMiniTitle", desc: "insurance.comprehensive.typeMiniDesc" },
                { title: "insurance.comprehensive.typeLimitedTitle", desc: "insurance.comprehensive.typeLimitedDesc" },
                { title: "insurance.comprehensive.typeExtendedTitle", desc: "insurance.comprehensive.typeExtendedDesc" },
                { title: "insurance.comprehensive.typeFullTitle", desc: "insurance.comprehensive.typeFullDesc" }
              ].map((card) => (
                <div
                  key={card.title}
                  className="flex flex-col items-center rounded-3xl border border-zinc-200/90 bg-white p-6 text-center shadow-sm shadow-zinc-900/5 insurance-hover-card transition-colors duration-300 dark:border-white/10 dark:bg-zinc-900 dark:shadow-black/40"
                >
                  <h3 className={`${recoleta.className} text-xl font-semibold leading-snug tracking-tight text-zinc-900 dark:text-white md:text-2xl`}>
                    {tr(t, card.title, "")}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-base">{tr(t, card.desc, "")}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <InsurancePartnerCompaniesSection />

        <ExpertReviewsCarousel />

        {/* What does it cover */}
        <section className="bg-white py-14 transition-colors duration-300 dark:bg-zinc-950">
          <div className="mx-auto max-w-[1440px] px-4">
            <h2 className={`${recoleta.className} text-center text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.comprehensive.coverTitle", "What does comprehensive car insurance cover?")}
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-center text-zinc-600 dark:text-zinc-300">{tr(t, "insurance.comprehensive.coverLead", "")}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {COVER_ITEMS.map((key) => (
                <li
                  key={key}
                  className="flex items-center gap-2 rounded-2xl border border-zinc-200/90 bg-zinc-50/90 px-4 py-4 insurance-hover-card transition-colors duration-300 dark:border-white/10 dark:bg-zinc-900/70"
                >
                  <FiCheck className="h-5 w-5 shrink-0 text-red-600 dark:text-zinc-300" />
                  <span className="text-sm font-medium leading-snug text-zinc-800 dark:text-zinc-100">{tr(t, key, "")}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Comparison table */}
        <section className="border-t border-zinc-200/90 bg-zinc-50 py-14 transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950">
          <div className="mx-auto max-w-[1440px] px-4">
            <h2 className={`${recoleta.className} text-center text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.comprehensive.compareTitle", "Compare coverage levels")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-zinc-600 dark:text-zinc-300">
              {tr(t, "insurance.comprehensive.compareLead", "Illustrative comparison — always check your policy wording.")}
            </p>
            <div className="mt-10 overflow-x-auto rounded-2xl border border-zinc-200/90 bg-white shadow-sm insurance-hover-card transition-colors duration-300 dark:border-white/10 dark:bg-zinc-900 dark:shadow-black/40">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-100 dark:border-white/10 dark:bg-zinc-800/70">
                    <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                      {tr(t, "insurance.comprehensive.compareFeatureCol", "Coverage")}
                    </th>
                    <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">{tr(t, "insurance.comprehensive.compareColMini", "Mini")}</th>
                    <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">{tr(t, "insurance.comprehensive.compareColLimited", "Limited")}</th>
                    <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">{tr(t, "insurance.comprehensive.compareColExtended", "Extended")}</th>
                    <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">{tr(t, "insurance.comprehensive.compareColFull", "Full")}</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row, i) => (
                    <tr
                      key={row.label}
                      className={[
                        "border-b border-zinc-100 transition-colors dark:border-white/10",
                        i % 2 === 1 ? "bg-zinc-50 dark:bg-white/[0.04]" : "bg-white dark:bg-transparent"
                      ].join(" ")}
                    >
                      <td className="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-100">{tr(t, row.label, "")}</td>
                      {row.cells.map((cellKey) => (
                        <td key={cellKey} className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                          {tr(t, cellKey, "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA — flat brand red */}
        <section
          id="contact-quote"
          className="scroll-mt-14 bg-red-600 py-14 transition-colors duration-300 dark:bg-black lg:scroll-mt-16"
        >
          <div className="mx-auto max-w-[1440px] px-4 text-center">
            <h2 className={`${recoleta.className} text-2xl font-bold text-white md:text-3xl`}>
              {tr(t, "insurance.comprehensive.bottomCtaTitle", "Ready for a tailored quote?")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/90 dark:text-white/85">{tr(t, "insurance.comprehensive.bottomCtaBody", "Contact İlsa Insurance for accurate pricing based on your vehicle and driving profile.")}</p>
            <a
              href="#contact-quote"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-red-700 shadow-lg shadow-red-900/20 ring-1 ring-white/30 transition hover:bg-red-50 hover:shadow-xl dark:bg-zinc-100 dark:text-zinc-950 dark:shadow-black/40 dark:ring-white/20 dark:hover:bg-white"
            >
              {tr(t, "insurance.comprehensive.bottomCtaButton", "Contact us")}
              <FiArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </InsuranceScrollMain>

      <SiteFooter />
    </div>
  );
}
