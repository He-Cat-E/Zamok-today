"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiCheck, FiX } from "react-icons/fi";
import { Topbar } from "@/components/Topbar";
import { SiteFooter } from "@/components/SiteFooter";
import { useT } from "@/i18n/I18nProvider";
import { recoleta } from "@/theme/fonts";

function tr(t: (k: string) => string, key: string, fallback: string) {
  const v = t(key);
  return v === key ? fallback : v;
}

const COVER_IDS = [1, 2, 3, 4, 5, 6, 7] as const;

const EXCLUSION_BLOCKS: ReadonlyArray<
  | { kind: "plain"; titleKey: string; bodyKey: string }
  | {
      kind: "link";
      titleKey: string;
      beforeKey: string;
      linkKey: string;
      afterKey: string;
    }
> = [
  { kind: "plain", titleKey: "insurance.travel.exclude1Title", bodyKey: "insurance.travel.exclude1Body" },
  {
    kind: "link",
    titleKey: "insurance.travel.exclude2Title",
    beforeKey: "insurance.travel.exclude2BeforeLink",
    linkKey: "insurance.travel.exclude2Link",
    afterKey: "insurance.travel.exclude2AfterLink"
  },
  {
    kind: "link",
    titleKey: "insurance.travel.exclude3Title",
    beforeKey: "insurance.travel.exclude3BeforeLink",
    linkKey: "insurance.travel.exclude3Link",
    afterKey: "insurance.travel.exclude3AfterLink"
  },
  { kind: "plain", titleKey: "insurance.travel.exclude4Title", bodyKey: "insurance.travel.exclude4Body" }
];

const EXTRA_IDS = [1, 2, 3, 4] as const;

const WHO_KEYS = [
  "insurance.travel.whoItem1",
  "insurance.travel.whoItem2",
  "insurance.travel.whoItem3",
  "insurance.travel.whoItem4",
  "insurance.travel.whoItem5"
] as const;

const WHY_KEYS = [
  "insurance.travel.why1",
  "insurance.travel.why2",
  "insurance.travel.why3",
  "insurance.travel.why4",
  "insurance.travel.why5"
] as const;

const HERO_IMAGE = "/Images/travel-insurance.jpg";

const EXPERT_SLIDE_INTERVAL_MS = 6500;

const EXPERT_REVIEWS = [
  {
    image: "/Images/reviews/man-1.jpg",
    quoteKey: "insurance.travel.expertSlide1Quote",
    nameKey: "insurance.travel.expertSlide1Name",
    roleKey: "insurance.travel.expertSlide1Role"
  },
  {
    image: "/Images/reviews/man-2.jpg",
    quoteKey: "insurance.travel.expertSlide2Quote",
    nameKey: "insurance.travel.expertSlide2Name",
    roleKey: "insurance.travel.expertSlide2Role"
  },
  {
    image: "/Images/reviews/man-3.jpg",
    quoteKey: "insurance.travel.expertSlide3Quote",
    nameKey: "insurance.travel.expertSlide3Name",
    roleKey: "insurance.travel.expertSlide3Role"
  }
] as const;

const EXPERT_FALLBACKS: ReadonlyArray<{ quote: string; name: string; role: string }> = [
  {
    quote:
      "Buy cover as soon as you confirm travel dates — cancellation protection starts from the policy inception you choose, and medical limits should match your destination’s treatment costs.",
    name: "Mehmet Yılmaz",
    role: "Travel underwriting — İlsa Insurance"
  },
  {
    quote:
      "Declare pre-existing conditions honestly — undisclosed conditions can affect claims. For adventure activities, check extensions or specialist cover before you go.",
    name: "Ayşe Demir",
    role: "Customer advisory — İlsa Insurance"
  },
  {
    quote:
      "For Schengen visas, confirm minimum medical limits and policy wording match embassy requirements — we help you pick certificates suitable for your application.",
    name: "Can Öztürk",
    role: "Visa & travel desk — İlsa Insurance"
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
          {tr(t, "insurance.travel.expertLabel", "Our expert says")}
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
            <Image src={slide.image} alt="" width={56} height={56} className="h-full w-full object-cover" />
          </div>
          <div
            className="text-center motion-safe:animate-expertFadeIn motion-reduce:animate-none"
            key={`meta-${active}`}
          >
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

export function TravelInsuranceClient() {
  const t = useT();

  return (
    <div className="flex min-h-dvh flex-col bg-zinc-50 text-zinc-900 transition-colors duration-300 selection:bg-red-200 selection:text-red-950 dark:bg-black dark:text-zinc-50 dark:selection:bg-zinc-700 dark:selection:text-zinc-100">
      <Topbar />

      <main className="flex-1">
        {/* Hero — brand red in light; solid black in dark (matches comprehensive car) */}
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
                  <li className="font-semibold text-white">
                    {tr(t, "insurance.travel.breadcrumbCurrent", "Travel insurance")}
                  </li>
                </ol>
              </nav>
              <h1 className={`${recoleta.className} text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl`}>
                {tr(t, "insurance.travel.heroTitle", "Travel insurance")}
              </h1>
              <p className="mt-3 text-lg text-white/95 md:text-xl">
                {tr(t, "insurance.travel.heroSubtitle", "Secure your journeys.")}
              </p>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/90 md:text-base">
                {tr(
                  t,
                  "insurance.travel.introP1",
                  "Travel insurance provides protection against unexpected health and emergency risks you may encounter during your domestic and international travels."
                )}
              </p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/90 md:text-base">
                {tr(
                  t,
                  "insurance.travel.introP2",
                  "At İlsa Insurance, we offer comprehensive travel insurance solutions so you can travel with peace of mind on vacation or business trips."
                )}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#contact-quote"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-red-700 shadow-lg shadow-red-900/15 ring-1 ring-white/20 transition hover:bg-red-50 hover:shadow-xl dark:bg-zinc-100 dark:text-zinc-950 dark:shadow-black/40 dark:ring-white/15 dark:hover:bg-white"
                >
                  {tr(t, "insurance.travel.ctaPrimary", "Get a quote")}
                  <FiArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact-quote"
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/90 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-[2px] transition hover:bg-white/15 dark:border-white/70 dark:bg-white/5 dark:hover:border-white dark:hover:bg-white/10"
                >
                  {tr(t, "insurance.travel.ctaSecondary", "Talk to an advisor")}
                  <FiArrowRight className="h-4 w-4" />
                </a>
              </div>
              <p className="mt-8 text-xs text-white/70 dark:text-white/60">
                {tr(t, "insurance.travel.mockDisclaimer", "Illustrative page — contact İlsa Insurance for binding quotes.")}
              </p>
            </div>
            <div className="relative mx-auto flex w-full max-w-xl justify-center lg:mx-0 lg:max-w-none lg:justify-end">
              <div className="relative aspect-[4/3] w-full max-w-[520px] overflow-hidden rounded-3xl bg-white/10 shadow-2xl shadow-black/20 ring-4 ring-white/25 dark:bg-zinc-900/40 dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.75)] dark:ring-white/10 lg:max-w-[600px]">
                <Image
                  src={HERO_IMAGE}
                  alt={tr(t, "insurance.travel.heroTitle", "Travel insurance")}
                  fill
                  className="object-cover object-center dark:brightness-[0.92] dark:contrast-[1.05]"
                  sizes="(max-width: 1024px) 100vw, 600px"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* How to compare — three steps */}
        <section className="border-b border-zinc-200/90 bg-white py-14 transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950">
          <div className="mx-auto max-w-[1440px] px-4">
            <h2 className={`${recoleta.className} text-center text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.travel.stepsTitle", "How to compare travel insurance")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-zinc-600 dark:text-zinc-300">
              {tr(t, "insurance.travel.stepsLead", "Three simple steps to a tailored travel quote.")}
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                { n: 1, title: "insurance.travel.step1Title", body: "insurance.travel.step1Body" },
                { n: 2, title: "insurance.travel.step2Title", body: "insurance.travel.step2Body" },
                { n: 3, title: "insurance.travel.step3Title", body: "insurance.travel.step3Body" }
              ].map((s) => (
                <div
                  key={s.n}
                  className="flex flex-col items-center rounded-3xl border border-zinc-200/90 bg-zinc-50/90 p-6 text-center shadow-sm shadow-zinc-900/5 transition-colors duration-300 dark:border-white/10 dark:bg-zinc-900/60 dark:shadow-black/40"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-red-600 text-xl font-bold tabular-nums leading-none text-white shadow-md shadow-red-900/25 dark:bg-zinc-950 dark:text-white dark:shadow-black/50 dark:ring-1 dark:ring-white/15 md:h-14 md:w-14 md:text-2xl">
                    {s.n}
                  </div>
                  <h3 className={`${recoleta.className} mt-5 text-xl font-semibold leading-snug tracking-tight text-zinc-900 dark:text-white md:text-2xl`}>
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

        {/* How much does it cost */}
        <section className="border-b border-zinc-200/90 bg-zinc-50 py-14 transition-colors duration-300 dark:border-white/10 dark:bg-black">
          <div className="mx-auto max-w-[800px] px-4">
            <h2 className={`${recoleta.className} text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.travel.costTitle", "How much does travel insurance cost?")}
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-300 md:text-lg">
              {tr(
                t,
                "insurance.travel.costBody",
                "The premium depends on your destination, trip length, age, medical history, activities planned, and the limits you choose. We compare options from multiple insurers so you see indicative pricing for your itinerary."
              )}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              {tr(
                t,
                "insurance.travel.costFootnote",
                "*Illustrative information for this page — not live market rates. Contact İlsa Insurance for a binding quote."
              )}
            </p>
          </div>
        </section>

        {/* What does travel insurance cover */}
        <section className="border-b border-zinc-200/90 bg-white py-14 transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950">
          <div className="mx-auto max-w-[1440px] px-4">
            <h2 className={`${recoleta.className} text-center text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.travel.coverTitle", "What does travel insurance cover?")}
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-center text-zinc-600 dark:text-zinc-300 md:text-lg">
              {tr(t, "insurance.travel.coverLead", "Depending on the chosen policy, it may include the following coverages:")}
            </p>
            <div className="mx-auto mt-10 flex max-w-[1200px] flex-wrap justify-center gap-4">
              {COVER_IDS.map((id) => (
                <div
                  key={id}
                  className="box-border flex w-full max-w-md shrink-0 flex-col rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-sm shadow-zinc-900/5 transition-colors duration-300 sm:max-w-none sm:w-[min(100%,20rem)] lg:w-[17.25rem] dark:border-white/10 dark:bg-zinc-900/80 dark:shadow-black/40"
                >
                  <div className="flex gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-red-600 text-white shadow-sm dark:bg-zinc-950 dark:ring-1 dark:ring-white/15">
                      <FiCheck className="h-5 w-5" />
                    </span>
                    <h3 className={`${recoleta.className} text-base font-semibold leading-snug text-zinc-900 dark:text-white md:text-lg`}>
                      {tr(t, `insurance.travel.coverItem${id}Title`, "")}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-base">
                    {tr(t, `insurance.travel.coverItem${id}Desc`, "")}
                  </p>
                </div>
              ))}
            </div>
            <p className="mx-auto mt-6 max-w-3xl text-center text-sm text-zinc-600 dark:text-zinc-400">
              {tr(
                t,
                "insurance.travel.coverFootnote",
                "Coverage may vary depending on the duration of travel and the country visited."
              )}
            </p>
          </div>
        </section>

        {/* What isn't covered */}
        <section className="border-b border-zinc-200/90 bg-zinc-100 py-14 transition-colors duration-300 dark:border-white/10 dark:bg-black">
          <div className="mx-auto max-w-[1440px] px-4">
            <h2 className={`${recoleta.className} text-center text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.travel.excludeTitle", "What isn't covered by travel insurance?")}
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-center text-zinc-600 dark:text-zinc-300 md:text-lg">
              {tr(
                t,
                "insurance.travel.excludeLead",
                "Read your policy documents carefully and make sure you understand common exclusions before you travel."
              )}
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {EXCLUSION_BLOCKS.map((block, idx) => (
                <div
                  key={idx}
                  className="flex flex-col rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950"
                >
                  <div className="flex gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-zinc-900 text-white dark:bg-red-700">
                      <FiX className="h-5 w-5" strokeWidth={2.5} />
                    </span>
                    <h3 className={`${recoleta.className} text-base font-semibold leading-snug text-zinc-900 dark:text-white md:text-lg`}>
                      {tr(t, block.titleKey, "")}
                    </h3>
                  </div>
                  {block.kind === "plain" ? (
                    <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-base">{tr(t, block.bodyKey, "")}</p>
                  ) : (
                    <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-base">
                      {tr(t, block.beforeKey, "")}
                      <Link href="#contact-quote" className="font-medium text-red-600 underline underline-offset-2 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                        {tr(t, block.linkKey, "")}
                      </Link>
                      {tr(t, block.afterKey, "")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Optional extras */}
        <section className="border-b border-zinc-200/90 bg-white py-14 transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950">
          <div className="mx-auto max-w-[1440px] px-4">
            <h2 className={`${recoleta.className} text-center text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.travel.extrasTitle", "Travel insurance optional extras")}
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-center text-zinc-600 dark:text-zinc-300 md:text-lg">
              {tr(
                t,
                "insurance.travel.extrasLead",
                "Base travel insurance does not cover everything. You can often add optional benefits — remember that add-ons usually increase the premium."
              )}
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {EXTRA_IDS.map((id) => (
                <div
                  key={id}
                  className="flex flex-col rounded-2xl border border-zinc-200/90 bg-zinc-50/90 p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900/70"
                >
                  <h3 className={`${recoleta.className} text-base font-semibold text-zinc-900 dark:text-white md:text-lg`}>
                    {tr(t, `insurance.travel.extra${id}Title`, "")}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-base">
                    {tr(t, `insurance.travel.extra${id}Body`, "")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who needs it */}
        <section className="border-b border-zinc-200/90 bg-zinc-100 py-14 transition-colors duration-300 dark:border-white/10 dark:bg-black">
          <div className="mx-auto max-w-[800px] px-4">
            <h2 className={`${recoleta.className} text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.travel.whoTitle", "Who needs travel insurance?")}
            </h2>
            <ul className="mt-8 flex flex-col gap-4">
              {WHO_KEYS.map((key) => (
                <li key={key} className="flex gap-3">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-red-600 text-white shadow-sm dark:bg-zinc-950 dark:ring-1 dark:ring-white/15">
                    <FiCheck className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                  <span className="text-sm font-medium leading-relaxed text-zinc-800 dark:text-zinc-100 md:text-base">{tr(t, key, "")}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 rounded-2xl border border-zinc-200/90 bg-white p-5 text-sm leading-relaxed text-zinc-700 shadow-sm dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 md:text-base">
              {tr(
                t,
                "insurance.travel.schengenNote",
                "Travel health insurance is mandatory, especially for travel to Schengen countries."
              )}
            </p>
          </div>
        </section>

        {/* Why İlsa Insurance */}
        <section className="border-b border-zinc-200/90 bg-white py-14 transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950">
          <div className="mx-auto max-w-[1440px] px-4">
            <h2 className={`${recoleta.className} text-center text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.travel.whyTitle", "Why İlsa Insurance?")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-zinc-600 dark:text-zinc-300">
              {tr(t, "insurance.travel.whyLead", "Fast issuance, visa-friendly certificates, and support when you need it.")}
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {WHY_KEYS.map((key, i) => (
                <div
                  key={key}
                  className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-200/90 bg-zinc-50/90 p-5 text-center shadow-sm shadow-zinc-900/5 transition-colors duration-300 dark:border-white/10 dark:bg-black dark:shadow-black/50"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-red-600 text-sm font-bold text-white shadow-sm dark:bg-zinc-950 dark:ring-1 dark:ring-white/15">
                    {i + 1}
                  </span>
                  <p className="text-sm font-medium leading-snug text-zinc-800 dark:text-zinc-100">{tr(t, key, "")}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ExpertReviewsCarousel />

        <section id="contact-quote" className="bg-red-600 py-14 transition-colors duration-300 dark:bg-black">
          <div className="mx-auto max-w-[1440px] px-4 text-center">
            <h2 className={`${recoleta.className} text-2xl font-bold text-white md:text-3xl`}>
              {tr(t, "insurance.travel.bottomCtaTitle", "Ready for your next trip?")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/90 dark:text-white/85">
              {tr(t, "insurance.travel.bottomCtaBody", "Contact İlsa Insurance for a tailored travel insurance quote.")}
            </p>
            <a
              href="#contact-quote"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-red-700 shadow-lg shadow-red-900/20 ring-1 ring-white/30 transition hover:bg-red-50 hover:shadow-xl dark:bg-zinc-100 dark:text-zinc-950 dark:shadow-black/40 dark:ring-white/20 dark:hover:bg-white"
            >
              {tr(t, "insurance.travel.bottomCtaButton", "Contact us")}
              <FiArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
