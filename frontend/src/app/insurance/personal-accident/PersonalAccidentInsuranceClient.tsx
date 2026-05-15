"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiCheck, FiChevronDown, FiChevronUp, FiHeart, FiPercent, FiTruck } from "react-icons/fi";
import { Topbar } from "@/components/Topbar";
import { InsuranceScrollMain } from "@/components/insurance/InsuranceScrollMain";
import { InsuranceDocumentLinks } from "@/components/insurance/InsuranceDocumentLinks";
import { InsurancePartnerCompaniesSection } from "@/components/insurance/InsurancePartnerCompaniesSection";
import { SiteFooter } from "@/components/SiteFooter";
import { useT } from "@/i18n/I18nProvider";

function tr(t: (k: string) => string, key: string, fallback: string) {
  const v = t(key);
  return v === key ? fallback : v;
}

/** Matches other insurance heroes: product name as one line (see insurance.home.heroTitle). */
function personalAccidentHeroTitle(t: (k: string) => string) {
  const h = t("insurance.personalAccident.heroTitle");
  if (h !== "insurance.personalAccident.heroTitle") return h;
  const b = t("insurance.personalAccident.breadcrumbCurrent");
  if (b !== "insurance.personalAccident.breadcrumbCurrent") return b;
  return "Personal accident insurance";
}

const HERO_IMAGE = "/Images/personal-accident-insurance.jpg";

const COVER_KEYS = [
  "insurance.personalAccident.coverItem1",
  "insurance.personalAccident.coverItem2",
  "insurance.personalAccident.coverItem3",
  "insurance.personalAccident.coverItem4",
  "insurance.personalAccident.coverItem5",
  "insurance.personalAccident.coverItem6"
] as const;

const WHO_KEYS = [
  "insurance.personalAccident.whoItem1",
  "insurance.personalAccident.whoItem2",
  "insurance.personalAccident.whoItem3",
  "insurance.personalAccident.whoItem4",
  "insurance.personalAccident.whoItem5"
] as const;

const WHY_KEYS = [
  "insurance.personalAccident.why1",
  "insurance.personalAccident.why2",
  "insurance.personalAccident.why3",
  "insurance.personalAccident.why4",
  "insurance.personalAccident.why5"
] as const;

const FAQ_KEYS = [
  { q: "insurance.personalAccident.faq1Q", a: "insurance.personalAccident.faq1A" },
  { q: "insurance.personalAccident.faq2Q", a: "insurance.personalAccident.faq2A" },
  { q: "insurance.personalAccident.faq3Q", a: "insurance.personalAccident.faq3A" },
  { q: "insurance.personalAccident.faq4Q", a: "insurance.personalAccident.faq4A" },
  { q: "insurance.personalAccident.faq5Q", a: "insurance.personalAccident.faq5A" },
  { q: "insurance.personalAccident.faq6Q", a: "insurance.personalAccident.faq6A" },
  { q: "insurance.personalAccident.faq7Q", a: "insurance.personalAccident.faq7A" },
  { q: "insurance.personalAccident.faq8Q", a: "insurance.personalAccident.faq8A" },
  { q: "insurance.personalAccident.faq9Q", a: "insurance.personalAccident.faq9A" },
  { q: "insurance.personalAccident.faq10Q", a: "insurance.personalAccident.faq10A" },
  { q: "insurance.personalAccident.faq11Q", a: "insurance.personalAccident.faq11A" }
] as const;

const ADV_CARDS = [
  { icon: FiTruck, titleKey: "insurance.personalAccident.adv1Title", bodyKey: "insurance.personalAccident.adv1Body" },
  { icon: FiHeart, titleKey: "insurance.personalAccident.adv2Title", bodyKey: "insurance.personalAccident.adv2Body" },
  { icon: FiPercent, titleKey: "insurance.personalAccident.adv3Title", bodyKey: "insurance.personalAccident.adv3Body" }
] as const;

const EXPERT_REVIEWS = [
  {
    image: "/Images/reviews/man-1.jpg",
    quoteKey: "insurance.personalAccident.expertSlide1Quote",
    nameKey: "insurance.personalAccident.expertSlide1Name",
    roleKey: "insurance.personalAccident.expertSlide1Role"
  },
  {
    image: "/Images/reviews/man-2.jpg",
    quoteKey: "insurance.personalAccident.expertSlide2Quote",
    nameKey: "insurance.personalAccident.expertSlide2Name",
    roleKey: "insurance.personalAccident.expertSlide2Role"
  },
  {
    image: "/Images/reviews/man-3.jpg",
    quoteKey: "insurance.personalAccident.expertSlide3Quote",
    nameKey: "insurance.personalAccident.expertSlide3Name",
    roleKey: "insurance.personalAccident.expertSlide3Role"
  }
] as const;

const EXPERT_FALLBACKS: ReadonlyArray<{ quote: string; name: string; role: string }> = [
  {
    quote:
      "Personal accident cover is about matching sums insured to your lifestyle and occupation — declare hazardous hobbies and work risks so your schedule reflects reality before a claim.",
    name: "Mehmet Yılmaz",
    role: "Personal lines underwriting — İlsa Insurance"
  },
  {
    quote:
      "Read exclusions for sports and travel carefully; extensions exist for many activities. Keep certificates and medical evidence organised — it speeds up claims.",
    name: "Ayşe Demir",
    role: "Customer advisory — İlsa Insurance"
  },
  {
    quote:
      "Compare waiting periods, benefit triggers, and disability definitions across insurers — small wording differences matter when you need the policy to respond.",
    name: "Can Öztürk",
    role: "Claims desk — İlsa Insurance"
  }
];

const DOC_ROWS = [
  {
    titleKey: "insurance.personalAccident.doc1Title",
    href: "/pdf/health-insurance/genel-sartlar.pdf",
    fileName: "genel-sartlar.pdf"
  },
  {
    titleKey: "insurance.personalAccident.doc2Title",
    href: "/pdf/health-insurance/quick-ferdi-kaza-sigortasi-bilgilendirme-formu.pdf",
    fileName: "quick-ferdi-kaza-sigortasi-bilgilendirme-formu.pdf"
  }
] as const;

const EXPERT_SLIDE_INTERVAL_MS = 6500;
const INITIAL_FAQ_VISIBLE = 5;

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
    <section
      id="professional-reviews"
      className="scroll-mt-32 border-y border-zinc-200/90 bg-zinc-100 py-14 transition-colors duration-300 dark:border-white/10 dark:bg-black"
    >
      <div className="mx-auto max-w-[800px] px-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-zinc-400">
          {tr(t, "insurance.personalAccident.expertLabel", "Our expert says")}
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
            className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-zinc-200 shadow-md ring-2 ring-brand-200/90 motion-safe:animate-expertFadeIn dark:bg-zinc-900 dark:ring-white/25 motion-reduce:animate-none"
          >
            <Image src={slide.image} alt="" width={56} height={56} className="h-full w-full object-cover" />
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
                i === active ? "w-8 bg-brand-600 dark:bg-zinc-100" : "w-2.5 bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-600 dark:hover:bg-zinc-500"
              ].join(" ")}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function PersonalAccidentInsuranceClient() {
  const t = useT();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [faqExpanded, setFaqExpanded] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col bg-zinc-50 text-zinc-900 transition-colors duration-300 selection:bg-brand-200 selection:text-brand-950 dark:bg-black dark:text-zinc-50 dark:selection:bg-zinc-700 dark:selection:text-zinc-100">
      <Topbar />

      <InsuranceScrollMain>
        <section className="relative overflow-hidden bg-brand-600 dark:bg-black">
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
                    {tr(t, "insurance.personalAccident.breadcrumbCurrent", "Personal accident insurance")}
                  </li>
                </ol>
              </nav>
              <h1 className={`text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl`}>
                {personalAccidentHeroTitle(t)}
              </h1>
              <p className="mt-3 text-lg text-white/95 md:text-xl">
                {tr(
                  t,
                  "insurance.personalAccident.heroSubtitle",
                  "Cover for death, disability, and medical costs after sudden accidents — at home, at work, or on the move."
                )}
              </p>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/90 md:text-base">
                {tr(
                  t,
                  "insurance.personalAccident.introP1",
                  "Personal accident insurance pays agreed benefits after sudden, unforeseen accidents that may cause death, permanent disability, or medical treatment costs."
                )}
              </p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/90 md:text-base">
                {tr(
                  t,
                  "insurance.personalAccident.introP2",
                  "As İlsa Insurance we compare personal accident programmes from leading insurers so you can choose limits and extensions that match your profile."
                )}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#contact-quote"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-brand-700 shadow-lg shadow-brand-900/15 ring-1 ring-white/20 transition hover:bg-brand-50 hover:shadow-xl dark:bg-zinc-100 dark:text-zinc-950 dark:shadow-black/40 dark:ring-white/15 dark:hover:bg-white"
                >
                  {tr(t, "insurance.personalAccident.ctaPrimary", "Get a quote")}
                  <FiArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact-quote"
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/90 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-[2px] transition hover:bg-white/15 dark:border-white/70 dark:bg-white/5 dark:hover:border-white dark:hover:bg-white/10"
                >
                  {tr(t, "insurance.personalAccident.ctaSecondary", "Talk to an advisor")}
                  <FiArrowRight className="h-4 w-4" />
                </a>
              </div>
              <p className="mt-8 text-xs text-white/70 dark:text-white/60">
                {tr(t, "insurance.personalAccident.mockDisclaimer", "Illustrative page — contact İlsa Insurance for binding quotes.")}
              </p>
            </div>
            <div className="relative mx-auto flex w-full max-w-xl justify-center lg:mx-0 lg:max-w-none lg:justify-end">
              <div className="relative aspect-[4/3] w-full max-w-[520px] overflow-hidden rounded-3xl bg-white/10 shadow-2xl shadow-black/20 ring-4 ring-white/25 dark:bg-zinc-900/40 dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.75)] dark:ring-white/10 lg:max-w-[600px]">
                <Image
                  src={HERO_IMAGE}
                  alt={personalAccidentHeroTitle(t)}
                  fill
                  className="object-cover object-center dark:brightness-[0.92] dark:contrast-[1.05]"
                  sizes="(max-width: 1024px) 100vw, 600px"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section
          id="overview"
          className="scroll-mt-32 border-b border-zinc-200/90 bg-white py-14 transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950"
        >
          <div className="mx-auto max-w-[800px] px-4">
            <h2 className={`text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.personalAccident.overviewTitle", "Why personal accident cover matters")}
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-300 md:text-lg">{tr(t, "insurance.personalAccident.overviewLead", "")}</p>
            <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-base">{tr(t, "insurance.personalAccident.overviewBody", "")}</p>
          </div>
        </section>

        <section
          id="advantages"
          className="scroll-mt-32 border-b border-zinc-200/90 bg-zinc-100 py-14 transition-colors duration-300 dark:border-white/10 dark:bg-black"
        >
          <div className="mx-auto max-w-[1440px] px-4">
            <h2 className={`text-center text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(
                t,
                "insurance.personalAccident.advSectionTitle",
                `${tr(t, "insurance.personalAccident.advTitleLine1", "Personal accident insurance")} — ${tr(t, "insurance.personalAccident.advTitleAccent", "Advantages")}`
              )}
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-center text-sm text-zinc-600 dark:text-zinc-300 md:text-base">
              {tr(t, "insurance.personalAccident.advLead", "")}
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {ADV_CARDS.map(({ icon: Icon, titleKey, bodyKey }) => (
                <div
                  key={titleKey}
                  className="flex flex-col rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm insurance-hover-card dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/40"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className={`mt-4 text-lg font-semibold text-zinc-900 dark:text-white`}>{tr(t, titleKey, "")}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-base">{tr(t, bodyKey, "")}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="what"
          className="scroll-mt-32 border-b border-zinc-200/90 bg-white py-14 transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950"
        >
          <div className="mx-auto max-w-[800px] px-4">
            <h2 className={`text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.personalAccident.whatIsTitleBefore", "What is personal accident insurance")}
              <span className="text-brand-600 dark:text-brand-400">{tr(t, "insurance.personalAccident.whatIsTitleMark", "?")}</span>
            </h2>
            <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-base">
              {tr(t, "insurance.personalAccident.whatIsBody", "")}
            </p>
          </div>
        </section>

        <section
          id="coverage"
          className="scroll-mt-32 border-b border-zinc-200/90 bg-zinc-100 py-14 transition-colors duration-300 dark:border-white/10 dark:bg-black"
        >
          <div className="mx-auto max-w-[800px] px-4">
            <h2 className={`text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.personalAccident.coverTitle", "What does personal accident insurance cover?")}
            </h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-300 md:text-lg">{tr(t, "insurance.personalAccident.coverLead", "")}</p>
            <ul className="mt-8 flex flex-col gap-3">
              {COVER_KEYS.map((key) => (
                <li
                  key={key}
                  className="flex gap-3 rounded-2xl border border-zinc-200/90 bg-white px-4 py-4 insurance-hover-card dark:border-white/10 dark:bg-zinc-950"
                >
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-600 text-white shadow-sm dark:bg-zinc-950 dark:ring-1 dark:ring-white/15">
                    <FiCheck className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                  <span className="text-sm font-medium leading-relaxed text-zinc-800 dark:text-zinc-100 md:text-base">{tr(t, key, "")}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">{tr(t, "insurance.personalAccident.coverFootnote", "")}</p>
          </div>
        </section>

        <section className="border-b border-zinc-200/90 bg-white py-14 transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950">
          <div className="mx-auto max-w-[800px] px-4">
            <h2 className={`text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.personalAccident.whoTitle", "Who is it for?")}
            </h2>
            <ul className="mt-8 flex flex-col gap-3">
              {WHO_KEYS.map((key) => (
                <li key={key} className="flex gap-3">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-600 text-white shadow-sm dark:bg-zinc-950 dark:ring-1 dark:ring-white/15">
                    <FiCheck className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                  <span className="text-sm font-medium leading-relaxed text-zinc-800 dark:text-zinc-100 md:text-base">{tr(t, key, "")}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-base">{tr(t, "insurance.personalAccident.whoFootnote", "")}</p>
          </div>
        </section>

        <section className="border-b border-zinc-200/90 bg-zinc-100 py-14 transition-colors duration-300 dark:border-white/10 dark:bg-black">
          <div className="mx-auto max-w-[1440px] px-4">
            <h2 className={`text-center text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.personalAccident.whyTitle", "Why İlsa Insurance?")}
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {WHY_KEYS.map((key, i) => (
                <div
                  key={key}
                  className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-200/90 bg-white p-5 text-center shadow-sm insurance-hover-card dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/50"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-brand-600 text-sm font-bold text-white shadow-sm dark:bg-zinc-950 dark:ring-1 dark:ring-white/15">
                    {i + 1}
                  </span>
                  <p className="text-sm font-medium leading-snug text-zinc-800 dark:text-zinc-100">{tr(t, key, "")}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-200/90 bg-white py-14 transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950">
          <div className="mx-auto max-w-[800px] px-4">
            <h2 className={`text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.personalAccident.pricingTitle", "Personal accident insurance premiums")}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-base">{tr(t, "insurance.personalAccident.pricingBody", "")}</p>
          </div>
        </section>

        <InsurancePartnerCompaniesSection />

        <section
          id="faq"
          className="scroll-mt-32 border-b border-zinc-200/90 bg-zinc-100 py-14 transition-colors duration-300 dark:border-white/10 dark:bg-black"
        >
          <div className="mx-auto grid max-w-[1200px] gap-10 px-4 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <h2 className={`text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
                {tr(t, "insurance.personalAccident.faqSectionTitle", "Frequently asked questions")}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-base">{tr(t, "insurance.personalAccident.faqSectionLead", "")}</p>
              <button
                type="button"
                className="mt-6 inline-flex items-center justify-center rounded-full border-2 border-brand-600 px-5 py-2.5 text-sm font-semibold text-brand-600 transition hover:bg-brand-600 hover:text-white dark:border-brand-400 dark:text-brand-400 dark:hover:bg-brand-500 dark:hover:text-white"
                onClick={() => {
                  setFaqExpanded(true);
                  document.getElementById("faq-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                {tr(t, "insurance.personalAccident.faqAllQuestions", "All questions")}
              </button>
            </div>
            <div className="lg:col-span-8" id="faq-list">
              <div className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200/90 bg-white dark:divide-white/10 dark:border-white/10 dark:bg-zinc-950">
                {FAQ_KEYS.map((item, idx) => {
                  const hidden = !faqExpanded && idx >= INITIAL_FAQ_VISIBLE;
                  const open = openFaq === idx;
                  return (
                    <div key={item.q} className={hidden ? "hidden" : ""}>
                      <button
                        type="button"
                        className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/60 sm:px-5 sm:py-5"
                        aria-expanded={open}
                        onClick={() => setOpenFaq((v) => (v === idx ? null : idx))}
                      >
                        <span className={`text-base font-semibold text-zinc-900 dark:text-white sm:text-lg`}>
                          {tr(t, item.q, "")}
                        </span>
                        <span className="mt-1 shrink-0 text-zinc-500 dark:text-zinc-400" aria-hidden>
                          {open ? <FiChevronUp className="h-5 w-5" /> : <FiChevronDown className="h-5 w-5" />}
                        </span>
                      </button>
                      {open ? (
                        <div className="px-4 pb-4 pt-0 sm:px-5 sm:pb-5">
                          <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-base">{tr(t, item.a, "")}</p>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
              {FAQ_KEYS.length > INITIAL_FAQ_VISIBLE ? (
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                    onClick={() => {
                      setFaqExpanded((prev) => {
                        const next = !prev;
                        if (prev && !next) {
                          setOpenFaq((o) => (o != null && o >= INITIAL_FAQ_VISIBLE ? null : o));
                        }
                        return next;
                      });
                    }}
                  >
                    {tr(t, faqExpanded ? "insurance.personalAccident.faqSeeLess" : "insurance.personalAccident.faqSeeMore", "See more questions")}
                    {faqExpanded ? <FiChevronUp className="h-4 w-4" aria-hidden /> : <FiChevronDown className="h-4 w-4" aria-hidden />}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section
          id="documents"
          className="scroll-mt-32 border-b border-zinc-200/90 bg-white py-14 transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950"
        >
          <div className="mx-auto max-w-[800px] px-4 text-center">
            <h2 className={`text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.personalAccident.docsTitle", "Related documents")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-600 dark:text-zinc-300 md:text-base">{tr(t, "insurance.personalAccident.docsLead", "")}</p>
            <InsuranceDocumentLinks rows={DOC_ROWS} downloadLabelKey="insurance.personalAccident.docDownload" />
            <p className="mt-6 text-xs text-zinc-500 dark:text-zinc-400">{tr(t, "insurance.personalAccident.docsNote", "")}</p>
          </div>
        </section>

        <ExpertReviewsCarousel />

        <section
          id="contact-quote"
          className="scroll-mt-14 bg-brand-600 py-14 transition-colors duration-300 dark:bg-black lg:scroll-mt-16"
        >
          <div className="mx-auto max-w-[1440px] px-4 text-center">
            <h2 className={`text-2xl font-bold text-white md:text-3xl`}>
              {tr(t, "insurance.personalAccident.bottomCtaTitle", "Ready to get covered?")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/90 dark:text-white/85">
              {tr(t, "insurance.personalAccident.bottomCtaBody", "Contact İlsa Insurance for a tailored personal accident insurance quote.")}
            </p>
            <a
              href="#contact-quote"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-lg shadow-brand-900/20 ring-1 ring-white/30 transition hover:bg-brand-50 hover:shadow-xl dark:bg-zinc-100 dark:text-zinc-950 dark:shadow-black/40 dark:ring-white/20 dark:hover:bg-white"
            >
              {tr(t, "insurance.personalAccident.bottomCtaButton", "Contact us")}
              <FiArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </InsuranceScrollMain>

      <SiteFooter />
    </div>
  );
}
