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

const COVER_KEYS = [
  "insurance.health.coverItem1",
  "insurance.health.coverItem2",
  "insurance.health.coverItem3",
  "insurance.health.coverItem4",
  "insurance.health.coverItem5",
  "insurance.health.coverItem6"
] as const;

const WHY_KEYS = [
  "insurance.health.why1",
  "insurance.health.why2",
  "insurance.health.why3",
  "insurance.health.why4",
  "insurance.health.why5"
] as const;

const BUY_BLOCKS: ReadonlyArray<{ titleKey: string; bodyKey: string }> = [
  { titleKey: "insurance.health.buyItem1Title", bodyKey: "insurance.health.buyItem1Body" },
  { titleKey: "insurance.health.buyItem2Title", bodyKey: "insurance.health.buyItem2Body" },
  { titleKey: "insurance.health.buyItem3Title", bodyKey: "insurance.health.buyItem3Body" }
];

const HERO_IMAGE = "/Images/health-insurance.jpg";
const EDU_IMAGE_WELLNESS = "/Images/health-insurance-1.webp";
const EDU_IMAGE_OUTDOOR = "/Images/halth-insurance-2.webp";

const EXPERT_SLIDE_INTERVAL_MS = 6500;

const EXPERT_REVIEWS = [
  {
    image: "/Images/reviews/man-1.jpg",
    quoteKey: "insurance.health.expertSlide1Quote",
    nameKey: "insurance.health.expertSlide1Name",
    roleKey: "insurance.health.expertSlide1Role"
  },
  {
    image: "/Images/reviews/man-2.jpg",
    quoteKey: "insurance.health.expertSlide2Quote",
    nameKey: "insurance.health.expertSlide2Name",
    roleKey: "insurance.health.expertSlide2Role"
  },
  {
    image: "/Images/reviews/man-3.jpg",
    quoteKey: "insurance.health.expertSlide3Quote",
    nameKey: "insurance.health.expertSlide3Name",
    roleKey: "insurance.health.expertSlide3Role"
  }
] as const;

const EXPERT_FALLBACKS: ReadonlyArray<{ quote: string; name: string; role: string }> = [
  {
    quote:
      "Health cover should match who needs protection and how you use care — not paying for benefits you will not use. Start with inpatient versus outpatient priorities, then add optional benefits that fit your family.",
    name: "Mehmet Yılmaz",
    role: "Health underwriting — İlsa Insurance"
  },
  {
    quote:
      "Network hospitals, deductibles, and annual limits matter as much as the headline premium — compare policies on the same basis before you bind cover.",
    name: "Ayşe Demir",
    role: "Customer advisory — İlsa Insurance"
  },
  {
    quote:
      "At renewal, update ages, family members, and any chronic conditions — small life changes often mean your cover should change too.",
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
          {tr(t, "insurance.health.expertLabel", "Our expert says")}
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

export function HealthInsuranceClient() {
  const t = useT();

  return (
    <div className="flex min-h-dvh flex-col bg-zinc-50 text-zinc-900 transition-colors duration-300 selection:bg-red-200 selection:text-red-950 dark:bg-black dark:text-zinc-50 dark:selection:bg-zinc-700 dark:selection:text-zinc-100">
      <Topbar />

      <InsuranceScrollMain>
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
                    {tr(t, "insurance.health.breadcrumbCurrent", "Health insurance")}
                  </li>
                </ol>
              </nav>
              <h1 className={`${recoleta.className} text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl`}>
                {tr(t, "insurance.health.heroTitle", "Health insurance")}
              </h1>
              <p className="mt-3 text-lg text-white/95 md:text-xl">
                {tr(t, "insurance.health.heroSubtitle", "Access private healthcare and protect your budget when it matters.")}
              </p>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/90 md:text-base">
                {tr(
                  t,
                  "insurance.health.introP1",
                  "Health insurance is an important safeguard that ensures you receive quality healthcare in private hospitals in case of unexpected illnesses and accidents."
                )}
              </p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/90 md:text-base">
                {tr(
                  t,
                  "insurance.health.introP2",
                  "At İlsa Insurance, we help you determine the most suitable individual or family health insurance package for your needs."
                )}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#contact-quote"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-red-700 shadow-lg shadow-red-900/15 ring-1 ring-white/20 transition hover:bg-red-50 hover:shadow-xl dark:bg-zinc-100 dark:text-zinc-950 dark:shadow-black/40 dark:ring-white/15 dark:hover:bg-white"
                >
                  {tr(t, "insurance.health.ctaPrimary", "Get a quote")}
                  <FiArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact-quote"
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/90 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-[2px] transition hover:bg-white/15 dark:border-white/70 dark:bg-white/5 dark:hover:border-white dark:hover:bg-white/10"
                >
                  {tr(t, "insurance.health.ctaSecondary", "Talk to an advisor")}
                  <FiArrowRight className="h-4 w-4" />
                </a>
              </div>
              <p className="mt-8 text-xs text-white/70 dark:text-white/60">
                {tr(t, "insurance.health.mockDisclaimer", "Illustrative page — contact İlsa Insurance for binding quotes.")}
              </p>
            </div>
            <div className="relative mx-auto flex w-full max-w-xl justify-center lg:mx-0 lg:max-w-none lg:justify-end">
              <div className="relative aspect-[4/3] w-full max-w-[520px] overflow-hidden rounded-3xl bg-white/10 shadow-2xl shadow-black/20 ring-4 ring-white/25 dark:bg-zinc-900/40 dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.75)] dark:ring-white/10 lg:max-w-[600px]">
                <Image
                  src={HERO_IMAGE}
                  alt={tr(t, "insurance.health.heroTitle", "Health insurance")}
                  fill
                  className="object-cover object-top dark:brightness-[0.92] dark:contrast-[1.05]"
                  sizes="(max-width: 1024px) 100vw, 600px"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Educational — What is health insurance? (image left, copy right) */}
        <section className="border-b border-zinc-200/90 bg-white py-14 transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950">
          <div className="mx-auto max-w-[1440px] px-4">
            <h2
              className={`${recoleta.className} text-center text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}
            >
              {tr(t, "insurance.health.eduWhatTitle", "What is health insurance?")}
            </h2>
            <div className="mt-10 grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
              <div className="relative mx-auto aspect-square w-full max-w-lg overflow-hidden rounded-3xl bg-zinc-100 shadow-xl shadow-zinc-900/10 ring-1 ring-zinc-200/90 dark:bg-zinc-900 dark:shadow-black/40 dark:ring-white/10 lg:mx-0">
                <Image
                  src={EDU_IMAGE_WELLNESS}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300 md:text-lg">
                  {tr(
                    t,
                    "insurance.health.eduWhatIntro",
                    "Health insurance in the UK is an insurance policy that provides healthcare cover in addition to the healthcare that everyone is entitled to on the National Health Service (NHS)."
                  )}
                </p>
                <ul className="mt-8 flex flex-col gap-6">
                  {[
                    {
                      titleKey: "insurance.health.eduWhatBullet1Title",
                      descKey: "insurance.health.eduWhatBullet1Desc",
                      fbTitle: "Quicker access",
                      fbDesc:
                        "Reduces your waiting time by allowing you to access private healthcare for you and your family."
                    },
                    {
                      titleKey: "insurance.health.eduWhatBullet2Title",
                      descKey: "insurance.health.eduWhatBullet2Desc",
                      fbTitle: "Different levels of cover",
                      fbDesc: "The greater your cover, the higher the premiums are likely to be."
                    },
                    {
                      titleKey: "insurance.health.eduWhatBullet3Title",
                      descKey: "insurance.health.eduWhatBullet3Desc",
                      fbTitle: "Choose when and where you're treated",
                      fbDesc:
                        "If you want to be treated at a private hospital, or you need specialist treatment, then private healthcare insurance could be an option for you."
                    }
                  ].map((b) => (
                    <li key={b.titleKey}>
                      <p className="text-base leading-relaxed text-zinc-800 dark:text-zinc-100 md:text-[17px]">
                        <span className="font-semibold text-zinc-900 dark:text-white">
                          {tr(t, b.titleKey, b.fbTitle)}
                        </span>{" "}
                        <span className="text-zinc-600 dark:text-zinc-400">—</span>{" "}
                        {tr(t, b.descKey, b.fbDesc)}
                      </p>
                    </li>
                  ))}
                </ul>
                <p className="mt-8 text-base leading-relaxed text-zinc-700 dark:text-zinc-300 md:text-lg">
                  {tr(
                    t,
                    "insurance.health.eduWhatClosing",
                    "You'll receive help for acute (immediate) conditions, and may also receive treatment for ongoing issues, depending on your policy."
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 1 — Compare / how it works (mirrors home “compare” block) */}
        <section className="border-b border-zinc-200/90 bg-white py-14 transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950">
          <div className="mx-auto max-w-[1440px] px-4">
            <h2 className={`${recoleta.className} text-center text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.health.workTitle", "How does it work?")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-zinc-600 dark:text-zinc-300">
              {tr(t, "insurance.health.workLead", "Three simple steps to compare and apply for health cover.")}
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                { n: 1, title: "insurance.health.step1Title", body: "insurance.health.step1Body" },
                { n: 2, title: "insurance.health.step2Title", body: "insurance.health.step2Body" },
                { n: 3, title: "insurance.health.step3Title", body: "insurance.health.step3Body" }
              ].map((s) => (
                <div
                  key={s.n}
                  className="flex flex-col items-center rounded-3xl border border-zinc-200/90 bg-zinc-50/90 p-6 text-center shadow-sm shadow-zinc-900/5 insurance-hover-card transition-colors duration-300 dark:border-white/10 dark:bg-zinc-900/60 dark:shadow-black/40"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-zinc-400 bg-white text-xl font-bold tabular-nums text-zinc-900 shadow-sm dark:border-zinc-500 dark:bg-zinc-950 dark:text-white md:h-14 md:w-14 md:text-2xl">
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

        {/* 2 — Product distinction (mirrors home DASK vs home insurance) */}
        <section className="border-b border-zinc-200/90 bg-zinc-100 py-14 transition-colors duration-300 dark:border-white/10 dark:bg-black">
          <div className="mx-auto max-w-[1440px] px-4 text-center">
            <h2 className={`${recoleta.className} text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.health.supplementaryTitle", "What is Supplementary Health Insurance?")}
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-zinc-700 dark:text-zinc-300 md:text-lg">
              {tr(
                t,
                "insurance.health.supplementaryBody",
                "Supplementary health insurance allows you to receive services at private hospitals contracted with the Social Security Institution (SGK) without paying any difference in fees. You can benefit from a wide range of health services with more affordable premiums."
              )}
            </p>
            <p className="mt-6">
              <Link
                href="/insurance/supplementary-health"
                className="text-sm font-semibold text-red-600 underline-offset-2 transition hover:text-red-700 hover:underline dark:text-red-400 dark:hover:text-red-300"
              >
                {tr(t, "insurance.health.supplementaryPageLink", "View supplementary health insurance (TSS) details")}
              </Link>
            </p>
          </div>
        </section>

        {/* 3 — What does health insurance cover? */}
        <section className="border-b border-zinc-200/90 bg-white py-14 transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950">
          <div className="mx-auto max-w-[1440px] px-4">
            <h2 className={`${recoleta.className} text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.health.coverTitle", "What does health insurance cover?")}
            </h2>
            <p className="mt-4 max-w-3xl text-zinc-600 dark:text-zinc-300">
              {tr(
                t,
                "insurance.health.coverLead",
                "Depending on the chosen policy type, it may include the following coverages:"
              )}
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:gap-4">
              {COVER_KEYS.map((key) => (
                <li
                  key={key}
                  className="flex gap-3 rounded-2xl border border-zinc-200/90 bg-zinc-50/90 p-4 insurance-hover-card transition-colors duration-300 dark:border-white/10 dark:bg-zinc-900/70"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-red-600 text-white shadow-sm shadow-red-900/20 dark:bg-zinc-950 dark:shadow-black/50 dark:ring-1 dark:ring-white/15">
                    <FiCheck className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-medium leading-snug text-zinc-800 dark:text-zinc-100 md:text-base">
                    {tr(t, key, "")}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">
              {tr(
                t,
                "insurance.health.coverFootnote",
                "Coverage scope may vary depending on the insurance company and the chosen package."
              )}
            </p>
          </div>
        </section>

        {/* 4 — How are health insurance prices determined? */}
        <section className="border-b border-zinc-200/90 bg-zinc-50 py-14 transition-colors duration-300 dark:border-white/10 dark:bg-black">
          <div className="mx-auto max-w-[800px] px-4 text-center">
            <h2 className={`${recoleta.className} text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.health.pricingTitle", "How are health insurance prices determined?")}
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-300 md:text-lg">
              {tr(
                t,
                "insurance.health.pricingBody",
                "Premiums vary depending on age, current health status, chosen coverage, and insurance company. We compare different options to offer you the best possible deal."
              )}
            </p>
          </div>
        </section>

        {/* 5 — Do I need private health insurance? (copy left, image right) */}
        <section className="border-b border-zinc-200/90 bg-white py-14 transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950">
          <div className="mx-auto max-w-[1440px] px-4">
            <h2
              className={`${recoleta.className} text-center text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}
            >
              {tr(t, "insurance.health.eduNeedTitle", "Do I need private health insurance?")}
            </h2>
            <div className="mt-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <div className="order-2 flex flex-col justify-center lg:order-1">
                <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300 md:text-lg">
                  {tr(
                    t,
                    "insurance.health.eduNeedIntro",
                    "Health insurance, otherwise known as private health care or private medical insurance, allows you to receive private medical treatment for a fee."
                  )}
                </p>
                <ul className="mt-8 flex flex-col gap-6">
                  {[
                    {
                      titleKey: "insurance.health.eduNeedBullet1Title",
                      descKey: "insurance.health.eduNeedBullet1Desc",
                      fbTitle: "Workplace benefits",
                      fbDesc:
                        "Some workplace benefit and pension schemes include private healthcare as part of their packages for staff. In that case, you may find that private healthcare is included for you and your family."
                    },
                    {
                      titleKey: "insurance.health.eduNeedBullet2Title",
                      descKey: "insurance.health.eduNeedBullet2Desc",
                      fbTitle: "Avoiding waiting lists",
                      fbDesc:
                        "However, if your workplace doesn't offer private health insurance as a benefit, or you work for yourself, then private health insurance can be useful if you need to be treated quickly at a hospital close to your home, and not have to join an NHS waiting list."
                    }
                  ].map((b) => (
                    <li key={b.titleKey}>
                      <p className="text-base leading-relaxed text-zinc-800 dark:text-zinc-100 md:text-[17px]">
                        <span className="font-semibold text-zinc-900 dark:text-white">
                          {tr(t, b.titleKey, b.fbTitle)}
                        </span>{" "}
                        <span className="text-zinc-600 dark:text-zinc-400">—</span>{" "}
                        {tr(t, b.descKey, b.fbDesc)}
                      </p>
                    </li>
                  ))}
                </ul>
                <p className="mt-8">
                  <a
                    href="#contact-quote"
                    className="text-base font-medium text-red-700 underline decoration-red-700/40 underline-offset-4 transition hover:text-red-800 hover:decoration-red-800 dark:text-red-400 dark:decoration-red-400/50 dark:hover:text-red-300"
                  >
                    {tr(
                      t,
                      "insurance.health.eduNeedLearnMore",
                      "Learn more about finding the right health cover for you."
                    )}
                  </a>
                </p>
              </div>
              <div className="relative order-1 flex justify-center lg:order-2 lg:justify-end">
                <div
                  className="pointer-events-none absolute -right-2 -top-3 hidden h-[108%] w-[92%] rounded-3xl bg-orange-100/90 dark:bg-orange-950/35 md:block"
                  aria-hidden
                />
                <div className="relative aspect-square w-full max-w-lg overflow-hidden rounded-3xl bg-zinc-100 shadow-xl shadow-zinc-900/10 ring-1 ring-zinc-200/90 dark:bg-zinc-900 dark:shadow-black/40 dark:ring-white/10">
                  <Image
                    src={EDU_IMAGE_OUTDOOR}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6 — Buying / what to weigh (mirrors home premium-drivers placement) */}
        <section className="border-b border-zinc-200/90 bg-zinc-100 py-14 transition-colors duration-300 dark:border-white/10 dark:bg-black">
          <div className="mx-auto max-w-[800px] px-4">
            <h2 className={`${recoleta.className} text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.health.buyTitle", "Buying health insurance")}
            </h2>
            <ul className="mt-8 flex flex-col gap-8">
              {BUY_BLOCKS.map(({ titleKey, bodyKey }) => (
                <li key={titleKey} className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-red-600 text-white shadow-sm shadow-red-900/20 dark:bg-zinc-950 dark:shadow-black/50 dark:ring-1 dark:ring-white/15">
                    <FiCheck className="h-5 w-5" strokeWidth={2.5} />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{tr(t, titleKey, "")}</h3>
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-base">
                      {tr(t, bodyKey, "")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 7 — Choose / understand cover levels (mirrors home “choose type”) */}
        <section className="border-b border-zinc-200/90 bg-white py-14 transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950">
          <div className="mx-auto max-w-[1440px] px-4">
            <h2 className={`${recoleta.className} text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.health.understandTitle", "Understanding health insurance?")}
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-md shadow-zinc-900/5 insurance-hover-card transition-colors duration-300 dark:border-white/10 dark:bg-black dark:shadow-black/40">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  {tr(t, "insurance.health.basicCoverTitle", "Basic health insurance cover")}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-base">
                  {tr(t, "insurance.health.basicCoverDesc", "")}
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-md shadow-zinc-900/5 insurance-hover-card transition-colors duration-300 dark:border-white/10 dark:bg-black dark:shadow-black/40">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  {tr(t, "insurance.health.mediumCoverTitle", "Medium health insurance cover")}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-base">
                  {tr(t, "insurance.health.mediumCoverDesc", "")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 8 — Why İlsa Insurance? */}
        <section className="border-b border-zinc-200/90 bg-zinc-100 py-14 transition-colors duration-300 dark:border-white/10 dark:bg-black">
          <div className="mx-auto max-w-[1440px] px-4">
            <h2 className={`${recoleta.className} text-center text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.health.whyTitle", "Why İlsa Insurance?")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-zinc-600 dark:text-zinc-300">
              {tr(t, "insurance.health.whyLead", "Compare options and move quickly with local support.")}
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {WHY_KEYS.map((key, i) => (
                <div
                  key={key}
                  className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-200/90 bg-white p-5 text-center shadow-sm shadow-zinc-900/5 insurance-hover-card transition-colors duration-300 dark:border-white/10 dark:bg-black dark:shadow-black/50"
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

        {/* Our expert says */}
        <InsurancePartnerCompaniesSection />

        <ExpertReviewsCarousel />

        <section
          id="contact-quote"
          className="scroll-mt-14 bg-red-600 py-14 transition-colors duration-300 dark:bg-black lg:scroll-mt-16"
        >
          <div className="mx-auto max-w-[1440px] px-4 text-center">
            <h2 className={`${recoleta.className} text-2xl font-bold text-white md:text-3xl`}>
              {tr(t, "insurance.health.bottomCtaTitle", "Ready to cover your health?")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/90 dark:text-white/85">
              {tr(t, "insurance.health.bottomCtaBody", "Contact İlsa Insurance for a tailored health insurance quote.")}
            </p>
            <a
              href="#contact-quote"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-red-700 shadow-lg shadow-red-900/20 ring-1 ring-white/30 transition hover:bg-red-50 hover:shadow-xl dark:bg-zinc-100 dark:text-zinc-950 dark:shadow-black/40 dark:ring-white/20 dark:hover:bg-white"
            >
              {tr(t, "insurance.health.bottomCtaButton", "Contact us")}
              <FiArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </InsuranceScrollMain>

      <SiteFooter />
    </div>
  );
}
