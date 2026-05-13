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
  "insurance.life.coverItem1",
  "insurance.life.coverItem2",
  "insurance.life.coverItem3",
  "insurance.life.coverItem4",
  "insurance.life.coverItem5"
] as const;

const IMPORTANT_KEYS = [
  "insurance.life.important1",
  "insurance.life.important2",
  "insurance.life.important3",
  "insurance.life.important4"
] as const;

const WHO_KEYS = [
  "insurance.life.whoItem1",
  "insurance.life.whoItem2",
  "insurance.life.whoItem3",
  "insurance.life.whoItem4"
] as const;

const WHY_KEYS = [
  "insurance.life.why1",
  "insurance.life.why2",
  "insurance.life.why3",
  "insurance.life.why4",
  "insurance.life.why5"
] as const;

const NEED_BULLET_KEYS = [
  "insurance.life.needAmountBullet1",
  "insurance.life.needAmountBullet2",
  "insurance.life.needAmountBullet3",
  "insurance.life.needAmountBullet4"
] as const;

const HERO_IMAGE = "/Images/life-insurance.jpg";
const WHAT_IS_IMAGE = "/Images/life-insurance-1.webp";
const BEST_QUOTE_IMAGE = "/Images/life-insurance-2.webp";
const TYPES_NEED_IMAGE = "/Images/life-insurance-3.webp";

const EXPERT_SLIDE_INTERVAL_MS = 6500;

const EXPERT_REVIEWS = [
  {
    image: "/Images/reviews/man-1.jpg",
    quoteKey: "insurance.life.expertSlide1Quote",
    nameKey: "insurance.life.expertSlide1Name",
    roleKey: "insurance.life.expertSlide1Role"
  },
  {
    image: "/Images/reviews/man-2.jpg",
    quoteKey: "insurance.life.expertSlide2Quote",
    nameKey: "insurance.life.expertSlide2Name",
    roleKey: "insurance.life.expertSlide2Role"
  },
  {
    image: "/Images/reviews/man-3.jpg",
    quoteKey: "insurance.life.expertSlide3Quote",
    nameKey: "insurance.life.expertSlide3Name",
    roleKey: "insurance.life.expertSlide3Role"
  }
] as const;

const EXPERT_FALLBACKS: ReadonlyArray<{ quote: string; name: string; role: string }> = [
  {
    quote:
      "Life cover should match who depends on your income and how long they need support — align sums insured and policy term with mortgages, education costs, and other liabilities.",
    name: "Mehmet Yılmaz",
    role: "Life underwriting — İlsa Insurance"
  },
  {
    quote:
      "Disclosure matters — health and lifestyle questions affect acceptance and claims. Compare like-for-like benefits and exclusions, not only the headline premium.",
    name: "Ayşe Demir",
    role: "Customer advisory — İlsa Insurance"
  },
  {
    quote:
      "Review cover at major life events — marriage, children, a new mortgage, or a career change often mean your protection should change too.",
    name: "Can Öztürk",
    role: "Protection planning — İlsa Insurance"
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
          {tr(t, "insurance.life.expertLabel", "Our expert says")}
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

export function LifeInsuranceClient() {
  const t = useT();

  return (
    <div className="flex min-h-dvh flex-col bg-zinc-50 text-zinc-900 transition-colors duration-300 selection:bg-red-200 selection:text-red-950 dark:bg-black dark:text-zinc-50 dark:selection:bg-zinc-700 dark:selection:text-zinc-100">
      <Topbar />

      <InsuranceScrollMain>
        {/* Hero — brand red in light; solid black in dark (matches health / comprehensive) */}
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
                    {tr(t, "insurance.life.breadcrumbCurrent", "Life insurance")}
                  </li>
                </ol>
              </nav>
              <h1 className={`${recoleta.className} text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl`}>
                {tr(t, "insurance.life.heroTitle", "Life insurance")}
              </h1>
              <p className="mt-3 text-lg text-white/95 md:text-xl">
                {tr(t, "insurance.life.heroSubtitle", "Protect your loved ones and secure their finances when it matters.")}
              </p>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/90 md:text-base">
                {tr(
                  t,
                  "insurance.life.introP1",
                  "Life insurance is an important safeguard that provides financial security for your family and loved ones if the unexpected happens."
                )}
              </p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/90 md:text-base">
                {tr(
                  t,
                  "insurance.life.introP2",
                  "At İlsa Insurance, we help you determine the most suitable life insurance solution for your needs and budget."
                )}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#contact-quote"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-red-700 shadow-lg shadow-red-900/15 ring-1 ring-white/20 transition hover:bg-red-50 hover:shadow-xl dark:bg-zinc-100 dark:text-zinc-950 dark:shadow-black/40 dark:ring-white/15 dark:hover:bg-white"
                >
                  {tr(t, "insurance.life.ctaPrimary", "Get a quote")}
                  <FiArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact-quote"
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/90 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-[2px] transition hover:bg-white/15 dark:border-white/70 dark:bg-white/5 dark:hover:border-white dark:hover:bg-white/10"
                >
                  {tr(t, "insurance.life.ctaSecondary", "Talk to an advisor")}
                  <FiArrowRight className="h-4 w-4" />
                </a>
              </div>
              <p className="mt-8 text-xs text-white/70 dark:text-white/60">
                {tr(t, "insurance.life.mockDisclaimer", "Illustrative page — contact İlsa Insurance for binding quotes.")}
              </p>
            </div>
            <div className="relative mx-auto flex w-full max-w-xl justify-center lg:mx-0 lg:max-w-none lg:justify-end">
              <div className="relative aspect-[4/3] w-full max-w-[520px] overflow-hidden rounded-3xl bg-white/10 shadow-2xl shadow-black/20 ring-4 ring-white/25 dark:bg-zinc-900/40 dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.75)] dark:ring-white/10 lg:max-w-[600px]">
                <Image
                  src={HERO_IMAGE}
                  alt={tr(t, "insurance.life.heroTitle", "Life insurance")}
                  fill
                  className="object-cover object-top dark:brightness-[0.92] dark:contrast-[1.05]"
                  sizes="(max-width: 1024px) 100vw, 600px"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* What is life insurance — split layout */}
        <section className="border-b border-zinc-200/90 bg-white py-14 transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-4 lg:grid-cols-2 lg:items-center lg:gap-14">
            <div className="relative order-2 lg:order-1">
              <div className="relative mx-auto max-w-lg">
                <div
                  className="absolute -bottom-5 -left-5 z-0 aspect-[4/3] w-[88%] rounded-3xl bg-zinc-200/90 dark:bg-zinc-800/80"
                  aria-hidden
                />
                <div className="relative z-10 aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-xl shadow-zinc-900/10 ring-1 ring-zinc-200/80 dark:shadow-black/40 dark:ring-white/10">
                  <Image
                    src={WHAT_IS_IMAGE}
                    alt=""
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 480px"
                  />
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className={`${recoleta.className} text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
                {tr(t, "insurance.life.whatIsTitle", "What is life insurance?")}
              </h2>
              <p className="mt-5 text-zinc-700 dark:text-zinc-300 md:text-lg">
                {tr(
                  t,
                  "insurance.life.whatIsP1",
                  "Life insurance helps protect your family and loved ones financially if you die."
                )}
              </p>
              <p className="mt-4 text-zinc-700 dark:text-zinc-300 md:text-lg">
                {tr(t, "insurance.life.whatIsP2", "")}
              </p>
              <p className="mt-4 text-zinc-700 dark:text-zinc-300 md:text-lg">
                {tr(t, "insurance.life.whatIsP3", "")}
              </p>
            </div>
          </div>
        </section>

        {/* How does it work */}
        <section className="border-b border-zinc-200/90 bg-zinc-100 py-14 transition-colors duration-300 dark:border-white/10 dark:bg-black">
          <div className="mx-auto max-w-[1440px] px-4">
            <h2 className={`${recoleta.className} text-center text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.life.workTitle", "How does it work?")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-zinc-600 dark:text-zinc-300">
              {tr(t, "insurance.life.workLead", "")}
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                { n: 1, title: "insurance.life.step1Title", body: "insurance.life.step1Body" },
                { n: 2, title: "insurance.life.step2Title", body: "insurance.life.step2Body" },
                { n: 3, title: "insurance.life.step3Title", body: "insurance.life.step3Body" }
              ].map((s) => (
                <div
                  key={s.n}
                  className="flex flex-col items-center rounded-3xl border border-zinc-200/90 bg-white/90 p-6 text-center shadow-sm shadow-zinc-900/5 insurance-hover-card transition-colors duration-300 dark:border-white/10 dark:bg-zinc-900/60 dark:shadow-black/40"
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

        {/* Cover */}
        <section className="border-b border-zinc-200/90 bg-white py-14 transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950">
          <div className="mx-auto max-w-[1440px] px-4">
            <h2 className={`${recoleta.className} text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.life.coverTitle", "What does life insurance cover?")}
            </h2>
            <p className="mt-4 max-w-3xl text-zinc-600 dark:text-zinc-300">
              {tr(t, "insurance.life.coverLead", "")}
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
              {tr(t, "insurance.life.coverFootnote", "")}
            </p>
          </div>
        </section>

        {/* Why İlsa */}
        <section className="border-b border-zinc-200/90 bg-zinc-50 py-14 transition-colors duration-300 dark:border-white/10 dark:bg-black">
          <div className="mx-auto max-w-[1440px] px-4">
            <h2 className={`${recoleta.className} text-center text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.life.whyTitle", "Why İlsa Insurance?")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-zinc-600 dark:text-zinc-300">
              {tr(t, "insurance.life.whyLead", "")}
            </p>
            <ul className="mx-auto mt-10 grid max-w-3xl gap-4">
              {WHY_KEYS.map((key) => (
                <li key={key} className="flex gap-3 text-zinc-800 dark:text-zinc-100">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red-600 dark:bg-red-400" />
                  <span>{tr(t, key, "")}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Who */}
        <section className="border-b border-zinc-200/90 bg-white py-14 transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950">
          <div className="mx-auto max-w-[1440px] px-4">
            <h2 className={`${recoleta.className} text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.life.whoTitle", "Who is it suitable for?")}
            </h2>
            <ul className="mt-8 grid gap-3 md:grid-cols-2">
              {WHO_KEYS.map((key) => (
                <li
                  key={key}
                  className="rounded-2xl border border-zinc-200/90 bg-zinc-50/90 px-5 py-4 text-zinc-800 insurance-hover-card dark:border-white/10 dark:bg-zinc-900/70 dark:text-zinc-100"
                >
                  {tr(t, key, "")}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* What type of life insurance — text left, image right (zinc accent mirrored for right column) */}
        <section className="border-b border-zinc-200/90 bg-zinc-50 py-14 transition-colors duration-300 dark:border-white/10 dark:bg-black">
          <div className="mx-auto max-w-[1440px] px-4">
            <h2 className={`${recoleta.className} text-center text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.life.typesNeedTitle", "What type of life insurance do I need?")}
            </h2>
            <div className="mt-10 grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
              <div className="flex flex-col justify-center">
                <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300 md:text-lg">
                  {tr(
                    t,
                    "insurance.life.typesNeedIntro",
                    "There are two different types of life insurance policies that work in different ways:"
                  )}
                </p>
                <ul className="mt-8 flex flex-col gap-6">
                  {[
                    {
                      titleKey: "insurance.life.typesNeedBullet1Title",
                      descKey: "insurance.life.typesNeedBullet1Desc",
                      fbTitle: "Level term life insurance:",
                      fbDesc:
                        "If you pass away during the policy term, your insurer will pay a lump sum agreed at the start of the policy."
                    },
                    {
                      titleKey: "insurance.life.typesNeedBullet2Title",
                      descKey: "insurance.life.typesNeedBullet2Desc",
                      fbTitle: "Decreasing term life insurance:",
                      fbDesc:
                        "The amount of cover reduces in line with your debts or other liabilities, such as the balance on your mortgage. It's important to review this protection if you move home, or increase your mortgage."
                    }
                  ].map((b) => (
                    <li key={b.titleKey}>
                      <p className="text-base leading-relaxed text-zinc-800 dark:text-zinc-100 md:text-[17px]">
                        <span className="font-semibold text-zinc-900 dark:text-white">{tr(t, b.titleKey, b.fbTitle)}</span>{" "}
                        <span className="text-zinc-600 dark:text-zinc-400">—</span> {tr(t, b.descKey, b.fbDesc)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative flex justify-center lg:justify-end">
                <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:ml-auto">
                  <div
                    className="absolute -bottom-5 -right-5 z-0 aspect-[4/3] w-[88%] rounded-3xl bg-zinc-200/90 dark:bg-zinc-800/80"
                    aria-hidden
                  />
                  <div className="relative z-10 aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-xl ring-1 ring-zinc-200/80 dark:ring-white/10">
                    <Image
                      src={TYPES_NEED_IMAGE}
                      alt=""
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 100vw, 480px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why important */}
        <section className="border-b border-zinc-200/90 bg-zinc-100 py-14 transition-colors duration-300 dark:border-white/10 dark:bg-black">
          <div className="mx-auto max-w-[1440px] px-4">
            <h2 className={`${recoleta.className} text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.life.importantTitle", "Why is life insurance important?")}
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {IMPORTANT_KEYS.map((key) => (
                <li
                  key={key}
                  className="flex gap-3 rounded-2xl border border-zinc-200/90 bg-white/90 p-5 insurance-hover-card dark:border-white/10 dark:bg-zinc-900/60"
                >
                  <FiCheck className="mt-0.5 h-6 w-6 shrink-0 text-red-600 dark:text-red-400" />
                  <span className="text-zinc-800 dark:text-zinc-100">{tr(t, key, "")}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* How much — grey panel */}
        <section className="border-b border-zinc-200/90 bg-white py-14 transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950">
          <div className="mx-auto max-w-[800px] px-4">
            <div className="rounded-3xl border border-zinc-200/90 bg-zinc-100/90 p-8 shadow-sm insurance-hover-card dark:border-white/10 dark:bg-zinc-900/60">
              <h2 className={`${recoleta.className} text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
                {tr(t, "insurance.life.needAmountTitle", "How much life insurance do I need?")}
              </h2>
              <p className="mt-5 text-zinc-700 dark:text-zinc-300">
                {tr(t, "insurance.life.needAmountIntro", "")}
              </p>
              <ul className="mt-6 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
                {NEED_BULLET_KEYS.map((key) => (
                  <li key={key}>{tr(t, key, "")}</li>
                ))}
              </ul>
              <p className="mt-6 text-zinc-700 dark:text-zinc-300">{tr(t, "insurance.life.needAmountP1", "")}</p>
              <p className="mt-4 text-zinc-700 dark:text-zinc-300">{tr(t, "insurance.life.needAmountP2", "")}</p>
              <p className="mt-8">
                <a
                  href="#contact-quote"
                  className="font-semibold text-red-600 underline underline-offset-4 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  {tr(t, "insurance.life.needAmountLinkText", "")}
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Best quote — image + text */}
        <section className="border-b border-zinc-200/90 bg-zinc-50 py-14 transition-colors duration-300 dark:border-white/10 dark:bg-black">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-4 lg:grid-cols-2 lg:items-center lg:gap-14">
            <div className="relative mx-auto max-w-lg lg:mx-0">
              <div
                className="absolute -bottom-5 -left-5 z-0 aspect-[4/3] w-[88%] rounded-3xl bg-zinc-200/90 dark:bg-zinc-800/80"
                aria-hidden
              />
              <div className="relative z-10 aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-xl ring-1 ring-zinc-200/80 dark:ring-white/10">
                <Image
                  src={BEST_QUOTE_IMAGE}
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 480px"
                />
              </div>
            </div>
            <div>
              <h2 className={`${recoleta.className} text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
                {tr(t, "insurance.life.bestQuoteTitle", "")}
              </h2>
              <p className="mt-5 text-zinc-700 dark:text-zinc-300 md:text-lg">{tr(t, "insurance.life.bestQuoteP1", "")}</p>
              <p className="mt-4 text-zinc-700 dark:text-zinc-300 md:text-lg">{tr(t, "insurance.life.bestQuoteP2", "")}</p>
              <p className="mt-4 text-zinc-700 dark:text-zinc-300 md:text-lg">{tr(t, "insurance.life.bestQuoteP3", "")}</p>
            </div>
          </div>
        </section>

        {/* When */}
        <section className="border-b border-zinc-200/90 bg-white py-14 transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950">
          <div className="mx-auto max-w-[800px] px-4">
            <div className="rounded-3xl border border-zinc-200/90 bg-zinc-100/90 p-8 shadow-sm insurance-hover-card dark:border-white/10 dark:bg-zinc-900/60">
              <h2 className={`${recoleta.className} text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
                {tr(t, "insurance.life.whenTitle", "")}
              </h2>
              <div className="mt-6 space-y-4 text-zinc-700 dark:text-zinc-300">
                <p>{tr(t, "insurance.life.whenP1", "")}</p>
                <p>{tr(t, "insurance.life.whenP2", "")}</p>
                <p>{tr(t, "insurance.life.whenP3", "")}</p>
                <p>{tr(t, "insurance.life.whenP4", "")}</p>
              </div>
              <p className="mt-8">
                <a
                  href="#contact-quote"
                  className="font-semibold text-red-600 underline underline-offset-4 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  {tr(t, "insurance.life.whenLinkText", "")}
                </a>
              </p>
            </div>
          </div>
        </section>

        <InsurancePartnerCompaniesSection />

        <ExpertReviewsCarousel />

        <section
          id="contact-quote"
          className="scroll-mt-14 bg-red-600 py-14 transition-colors duration-300 dark:bg-black lg:scroll-mt-16"
        >
          <div className="mx-auto max-w-[800px] px-4 text-center text-white">
            <h2 className={`${recoleta.className} text-2xl font-bold md:text-3xl`}>
              {tr(t, "insurance.life.bottomCtaTitle", "Ready to protect those who matter most?")}
            </h2>
            <p className="mt-4 text-white/95 md:text-lg">
              {tr(t, "insurance.life.bottomCtaBody", "Contact İlsa Insurance for a tailored life insurance quote.")}
            </p>
            <a
              href="#contact-quote"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-red-700 shadow-lg shadow-red-900/20 ring-1 ring-white/25 transition hover:bg-red-50 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
            >
              {tr(t, "insurance.life.bottomCtaButton", "Contact us")}
              <FiArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </InsuranceScrollMain>

      <SiteFooter />
    </div>
  );
}
