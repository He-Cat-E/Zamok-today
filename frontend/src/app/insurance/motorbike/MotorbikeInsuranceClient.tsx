"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import { Topbar } from "@/components/Topbar";
import { InsuranceScrollMain } from "@/components/insurance/InsuranceScrollMain";
import { SiteFooter } from "@/components/SiteFooter";
import { useT } from "@/i18n/I18nProvider";
import { recoleta } from "@/theme/fonts";

function tr(t: (k: string) => string, key: string, fallback: string) {
  const v = t(key);
  return v === key ? fallback : v;
}

const COVER_KEYS = [
  "insurance.motorbike.coverItem1",
  "insurance.motorbike.coverItem2",
  "insurance.motorbike.coverItem3",
  "insurance.motorbike.coverItem4",
  "insurance.motorbike.coverItem5"
] as const;

const IMPORTANT_KEYS = [
  "insurance.motorbike.important1",
  "insurance.motorbike.important2",
  "insurance.motorbike.important3",
  "insurance.motorbike.important4"
] as const;

const WHY_KEYS = [
  "insurance.motorbike.why1",
  "insurance.motorbike.why2",
  "insurance.motorbike.why3",
  "insurance.motorbike.why4",
  "insurance.motorbike.why5"
] as const;

const HERO_IMAGE = "/Images/motor-insurance.png";
const WHAT_IS_IMAGE = "/Images/motor-insurance-1.webp";

const EXPERT_SLIDE_INTERVAL_MS = 6500;

const EXPERT_REVIEWS = [
  {
    image: "/Images/reviews/man-1.jpg",
    quoteKey: "insurance.motorbike.expertSlide1Quote",
    nameKey: "insurance.motorbike.expertSlide1Name",
    roleKey: "insurance.motorbike.expertSlide1Role"
  },
  {
    image: "/Images/reviews/man-2.jpg",
    quoteKey: "insurance.motorbike.expertSlide2Quote",
    nameKey: "insurance.motorbike.expertSlide2Name",
    roleKey: "insurance.motorbike.expertSlide2Role"
  },
  {
    image: "/Images/reviews/man-3.jpg",
    quoteKey: "insurance.motorbike.expertSlide3Quote",
    nameKey: "insurance.motorbike.expertSlide3Name",
    roleKey: "insurance.motorbike.expertSlide3Role"
  }
] as const;

const EXPERT_FALLBACKS: ReadonlyArray<{ quote: string; name: string; role: string }> = [
  {
    quote:
      "Match your declared usage to how you actually ride — commuting and business use affect pricing and claims. Tell us your licence class, annual mileage, and security measures.",
    name: "Mehmet Yılmaz",
    role: "Motor underwriting — İlsa Insurance"
  },
  {
    quote:
      "Compulsory cover is for third parties only — if you want theft, fire, or damage to your own bike, ask about comprehensive (kasko) options alongside MTPL.",
    name: "Ayşe Demir",
    role: "Customer advisory — İlsa Insurance"
  },
  {
    quote:
      "Renew before expiry — a lapse can leave you uninsured on the road. Our reminders help you stay continuous and compliant.",
    name: "Can Öztürk",
    role: "Renewals & claims desk — İlsa Insurance"
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
          {tr(t, "insurance.motorbike.expertLabel", "Our expert says")}
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

export function MotorbikeInsuranceClient() {
  const t = useT();

  return (
    <div className="flex min-h-dvh flex-col bg-zinc-50 text-zinc-900 transition-colors duration-300 selection:bg-red-200 selection:text-red-950 dark:bg-black dark:text-zinc-50 dark:selection:bg-zinc-700 dark:selection:text-zinc-100">
      <Topbar />

      <InsuranceScrollMain>
        {/* Hero — brand red in light; solid black in dark (matches health / life) */}
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
                    {tr(t, "insurance.motorbike.breadcrumbCurrent", "Compulsory traffic insurance")}
                  </li>
                </ol>
              </nav>
              <h1 className={`${recoleta.className} text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl`}>
                {tr(t, "insurance.motorbike.heroTitle", "Compulsory traffic insurance")}
              </h1>
              <p className="mt-3 text-lg text-white/95 md:text-xl">
                {tr(
                  t,
                  "insurance.motorbike.heroSubtitle",
                  "Legal and safe riding for motorbikes and scooters — meet your third-party liability obligations on the road."
                )}
              </p>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/90 md:text-base">
                {tr(
                  t,
                  "insurance.motorbike.introP1",
                  "Compulsory traffic insurance is mandatory motor liability cover for vehicle owners."
                )}
              </p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/90 md:text-base">
                {tr(t, "insurance.motorbike.introP2", "")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#contact-quote"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-red-700 shadow-lg shadow-red-900/15 ring-1 ring-white/20 transition hover:bg-red-50 hover:shadow-xl dark:bg-zinc-100 dark:text-zinc-950 dark:shadow-black/40 dark:ring-white/15 dark:hover:bg-white"
                >
                  {tr(t, "insurance.motorbike.ctaPrimary", "Get a quote")}
                  <FiArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact-quote"
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/90 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-[2px] transition hover:bg-white/15 dark:border-white/70 dark:bg-white/5 dark:hover:border-white dark:hover:bg-white/10"
                >
                  {tr(t, "insurance.motorbike.ctaSecondary", "Talk to an advisor")}
                  <FiArrowRight className="h-4 w-4" />
                </a>
              </div>
              <p className="mt-8 text-xs text-white/70 dark:text-white/60">
                {tr(t, "insurance.motorbike.mockDisclaimer", "")}
              </p>
            </div>
            <div className="relative mx-auto flex w-full max-w-xl justify-center lg:mx-0 lg:max-w-none lg:justify-end">
              <div className="relative aspect-[4/3] w-full max-w-[520px] overflow-hidden rounded-3xl bg-white/10 shadow-2xl shadow-black/20 ring-4 ring-white/25 dark:bg-zinc-900/40 dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.75)] dark:ring-white/10 lg:max-w-[600px]">
                <Image
                  src={HERO_IMAGE}
                  alt={tr(t, "insurance.motorbike.heroTitle", "Compulsory traffic insurance")}
                  fill
                  className="object-cover object-center dark:brightness-[0.92] dark:contrast-[1.05]"
                  sizes="(max-width: 1024px) 100vw, 600px"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* What is compulsory traffic insurance */}
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
                {tr(t, "insurance.motorbike.whatIsTitle", "What is compulsory traffic insurance?")}
              </h2>
              <p className="mt-5 text-zinc-700 dark:text-zinc-300 md:text-lg">
                {tr(t, "insurance.motorbike.whatIsP1", "")}
              </p>
              <p className="mt-4 text-zinc-700 dark:text-zinc-300 md:text-lg">{tr(t, "insurance.motorbike.whatIsP2", "")}</p>
            </div>
          </div>
        </section>

        {/* How does it work */}
        <section className="border-b border-zinc-200/90 bg-zinc-100 py-14 transition-colors duration-300 dark:border-white/10 dark:bg-black">
          <div className="mx-auto max-w-[1440px] px-4">
            <h2 className={`${recoleta.className} text-center text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.motorbike.workTitle", "How does it work?")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-zinc-600 dark:text-zinc-300">
              {tr(t, "insurance.motorbike.workLead", "")}
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                { n: 1, title: "insurance.motorbike.step1Title", body: "insurance.motorbike.step1Body" },
                { n: 2, title: "insurance.motorbike.step2Title", body: "insurance.motorbike.step2Body" },
                { n: 3, title: "insurance.motorbike.step3Title", body: "insurance.motorbike.step3Body" }
              ].map((s) => (
                <div
                  key={s.n}
                  className="flex flex-col items-center rounded-3xl border border-zinc-200/90 bg-white/90 p-6 text-center shadow-sm shadow-zinc-900/5 transition-colors duration-300 dark:border-white/10 dark:bg-zinc-900/60 dark:shadow-black/40"
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
              {tr(t, "insurance.motorbike.coverTitle", "")}
            </h2>
            <p className="mt-4 max-w-3xl text-zinc-600 dark:text-zinc-300">{tr(t, "insurance.motorbike.coverLead", "")}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:gap-4">
              {COVER_KEYS.map((key) => (
                <li
                  key={key}
                  className="flex gap-3 rounded-2xl border border-zinc-200/90 bg-zinc-50/90 p-4 transition-colors duration-300 dark:border-white/10 dark:bg-zinc-900/70"
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
            <p className="mt-6 max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">{tr(t, "insurance.motorbike.coverFootnote", "")}</p>
          </div>
        </section>

        {/* Pricing */}
        <section className="border-b border-zinc-200/90 bg-zinc-50 py-14 transition-colors duration-300 dark:border-white/10 dark:bg-black">
          <div className="mx-auto max-w-[800px] px-4">
            <div className="rounded-3xl border border-zinc-200/90 bg-zinc-100/90 p-8 shadow-sm dark:border-white/10 dark:bg-zinc-900/60">
              <h2 className={`${recoleta.className} text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
                {tr(t, "insurance.motorbike.pricingTitle", "")}
              </h2>
              <p className="mt-6 text-zinc-700 dark:text-zinc-300 md:text-lg">{tr(t, "insurance.motorbike.pricingBody", "")}</p>
            </div>
          </div>
        </section>

        {/* Why İlsa */}
        <section className="border-b border-zinc-200/90 bg-white py-14 transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950">
          <div className="mx-auto max-w-[1440px] px-4">
            <h2 className={`${recoleta.className} text-center text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.motorbike.whyTitle", "")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-zinc-600 dark:text-zinc-300">
              {tr(t, "insurance.motorbike.whyLead", "")}
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

        {/* Why important */}
        <section className="border-b border-zinc-200/90 bg-zinc-100 py-14 transition-colors duration-300 dark:border-white/10 dark:bg-black">
          <div className="mx-auto max-w-[1440px] px-4">
            <h2 className={`${recoleta.className} text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.motorbike.importantTitle", "")}
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {IMPORTANT_KEYS.map((key) => (
                <li
                  key={key}
                  className="flex gap-3 rounded-2xl border border-zinc-200/90 bg-white/90 p-5 dark:border-white/10 dark:bg-zinc-900/60"
                >
                  <FiCheck className="mt-0.5 h-6 w-6 shrink-0 text-red-600 dark:text-red-400" />
                  <span className="text-zinc-800 dark:text-zinc-100">{tr(t, key, "")}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <ExpertReviewsCarousel />

        <section
          id="contact-quote"
          className="scroll-mt-14 bg-red-600 py-14 transition-colors duration-300 dark:bg-black lg:scroll-mt-16"
        >
          <div className="mx-auto max-w-[800px] px-4 text-center text-white">
            <h2 className={`${recoleta.className} text-2xl font-bold md:text-3xl`}>
              {tr(t, "insurance.motorbike.bottomCtaTitle", "")}
            </h2>
            <p className="mt-4 text-white/95 md:text-lg">{tr(t, "insurance.motorbike.bottomCtaBody", "")}</p>
            <a
              href="#contact-quote"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-red-700 shadow-lg shadow-red-900/20 ring-1 ring-white/25 transition hover:bg-red-50 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
            >
              {tr(t, "insurance.motorbike.bottomCtaButton", "Contact us")}
              <FiArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </InsuranceScrollMain>

      <SiteFooter />
    </div>
  );
}
