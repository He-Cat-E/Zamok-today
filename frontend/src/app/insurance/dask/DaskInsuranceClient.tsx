"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiCheck, FiChevronDown, FiChevronUp, FiX } from "react-icons/fi";
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

function daskHeroTitle(t: (k: string) => string) {
  const h = t("insurance.dask.heroTitle");
  if (h !== "insurance.dask.heroTitle") return h;
  const b = t("insurance.dask.breadcrumbCurrent");
  if (b !== "insurance.dask.breadcrumbCurrent") return b;
  return "DASK (Compulsory Earthquake Insurance)";
}

const HERO_IMAGE = "/Images/dask-insurance.jpg";

const COVER_KEYS = [
  "insurance.dask.coverItem1",
  "insurance.dask.coverItem2",
  "insurance.dask.coverItem3",
  "insurance.dask.coverItem4",
  "insurance.dask.coverItem5",
  "insurance.dask.coverItem6"
] as const;

const WHY_KEYS = [
  "insurance.dask.why1",
  "insurance.dask.why2",
  "insurance.dask.why3",
  "insurance.dask.why4",
  "insurance.dask.why5"
] as const;

const PRICING_BULLET_KEYS = [
  "insurance.dask.pricingBullet1",
  "insurance.dask.pricingBullet2",
  "insurance.dask.pricingBullet3",
  "insurance.dask.pricingBullet4"
] as const;

const NEED_LIST_KEYS = [
  "insurance.dask.needList1",
  "insurance.dask.needList2",
  "insurance.dask.needList3",
  "insurance.dask.needList4",
  "insurance.dask.needList5"
] as const;

const FAQ_KEYS = [
  { q: "insurance.dask.faq1Q", a: "insurance.dask.faq1A" },
  { q: "insurance.dask.faq2Q", a: "insurance.dask.faq2A" },
  { q: "insurance.dask.faq3Q", a: "insurance.dask.faq3A" },
  { q: "insurance.dask.faq4Q", a: "insurance.dask.faq4A" },
  { q: "insurance.dask.faq5Q", a: "insurance.dask.faq5A" },
  { q: "insurance.dask.faq6Q", a: "insurance.dask.faq6A" },
  { q: "insurance.dask.faq7Q", a: "insurance.dask.faq7A" },
  { q: "insurance.dask.faq8Q", a: "insurance.dask.faq8A" }
] as const;

const DOC_ROWS = [
  {
    titleKey: "insurance.dask.doc1Title",
    href: "/pdf/dask/genel-sartlar.pdf",
    fileName: "genel-sartlar.pdf"
  },
  {
    titleKey: "insurance.dask.doc2Title",
    href: "/pdf/dask/quick-dask-sigortasi-bilgilendirme-formu.pdf",
    fileName: "quick-dask-sigortasi-bilgilendirme-formu.pdf"
  }
] as const;

const EXPERT_REVIEWS = [
  {
    image: "/Images/reviews/man-1.jpg",
    quoteKey: "insurance.dask.expertSlide1Quote",
    nameKey: "insurance.dask.expertSlide1Name",
    roleKey: "insurance.dask.expertSlide1Role"
  },
  {
    image: "/Images/reviews/man-2.jpg",
    quoteKey: "insurance.dask.expertSlide2Quote",
    nameKey: "insurance.dask.expertSlide2Name",
    roleKey: "insurance.dask.expertSlide2Role"
  },
  {
    image: "/Images/reviews/man-3.jpg",
    quoteKey: "insurance.dask.expertSlide3Quote",
    nameKey: "insurance.dask.expertSlide3Name",
    roleKey: "insurance.dask.expertSlide3Role"
  }
] as const;

const EXPERT_FALLBACKS: ReadonlyArray<{ quote: string; name: string; role: string }> = [
  {
    quote:
      "Keep your UAVT address code handy — DASK pricing and eligibility are tied to the insured location and building characteristics declared at quote stage.",
    name: "Mehmet Yılmaz",
    role: "Property underwriting — İlsa Insurance"
  },
  {
    quote:
      "Treat DASK as the mandatory structural baseline; add home insurance when you need contents, glass, and broader risks beyond earthquake.",
    name: "Ayşe Demir",
    role: "Customer advisory — İlsa Insurance"
  },
  {
    quote:
      "Renew before expiry — utilities and many official processes expect continuous valid earthquake cover.",
    name: "Can Öztürk",
    role: "Renewals specialist — İlsa Insurance"
  }
];

const EXPERT_SLIDE_INTERVAL_MS = 6500;
const INITIAL_FAQ_VISIBLE = 5;

function CellCovered({ t, yes }: { t: (k: string) => string; yes: boolean }) {
  const label = yes ? tr(t, "insurance.dask.compareCovered", "Covered") : tr(t, "insurance.dask.compareNotCovered", "Not covered");
  return (
    <div className="flex justify-center" title={label}>
      <span className="sr-only">{label}</span>
      {yes ? (
        <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-600 text-white shadow-sm dark:bg-emerald-700">
          <FiCheck className="h-5 w-5" strokeWidth={2.5} aria-hidden />
        </span>
      ) : (
        <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-600 text-white shadow-sm dark:bg-brand-700">
          <FiX className="h-5 w-5" strokeWidth={2.5} aria-hidden />
        </span>
      )}
    </div>
  );
}

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
          {tr(t, "insurance.dask.expertLabel", "Our expert says")}
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

export function DaskInsuranceClient() {
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
                  <li className="font-semibold text-white">{tr(t, "insurance.dask.breadcrumbCurrent", "DASK (Compulsory Earthquake Insurance)")}</li>
                </ol>
              </nav>
              <h1 className={`text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl`}>{daskHeroTitle(t)}</h1>
              <p className="mt-3 text-lg text-white/95 md:text-xl">
                {tr(
                  t,
                  "insurance.dask.heroSubtitle",
                  "Mandatory, reliable protection for your home against earthquakes and quake-related damage."
                )}
              </p>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/90 md:text-base">
                {tr(
                  t,
                  "insurance.dask.introP1",
                  "DASK (compulsory earthquake insurance) is the legal product in Türkiye that secures residential buildings against earthquake and earthquake-related losses. It is required for homeowners and is requested for title work, electricity and water subscriptions, and many other formalities."
                )}
              </p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/90 md:text-base">
                {tr(
                  t,
                  "insurance.dask.introP2",
                  "As İlsa Insurance we arrange your DASK policy quickly at competitive prices and help you keep your property continuously protected."
                )}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#contact-quote"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-brand-700 shadow-lg shadow-brand-900/15 ring-1 ring-white/20 transition hover:bg-brand-50 hover:shadow-xl dark:bg-zinc-100 dark:text-zinc-950 dark:shadow-black/40 dark:ring-white/15 dark:hover:bg-white"
                >
                  {tr(t, "insurance.dask.ctaPrimary", "Get a quote")}
                  <FiArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact-quote"
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/90 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-[2px] transition hover:bg-white/15 dark:border-white/70 dark:bg-white/5 dark:hover:border-white dark:hover:bg-white/10"
                >
                  {tr(t, "insurance.dask.ctaSecondary", "Talk to an advisor")}
                  <FiArrowRight className="h-4 w-4" />
                </a>
              </div>
              <p className="mt-8 text-xs text-white/70 dark:text-white/60">
                {tr(t, "insurance.dask.mockDisclaimer", "Illustrative page — contact İlsa Insurance for binding quotes and official DASK policy documents.")}
              </p>
            </div>
            <div className="relative mx-auto flex w-full max-w-xl justify-center lg:mx-0 lg:max-w-none lg:justify-end">
              <div className="relative aspect-[4/3] w-full max-w-[520px] overflow-hidden rounded-3xl bg-white/10 shadow-2xl shadow-black/20 ring-4 ring-white/25 dark:bg-zinc-900/40 dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.75)] dark:ring-white/10 lg:max-w-[600px]">
                <Image
                  src={HERO_IMAGE}
                  alt={daskHeroTitle(t)}
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
          id="what-to-know"
          className="scroll-mt-32 border-b border-zinc-200/90 bg-white py-14 transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950"
        >
          <div className="mx-auto max-w-[800px] px-4">
            <h2 className={`text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.dask.needTitle", "What you need to know about compulsory earthquake insurance (DASK)")}
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-base">
              {tr(
                t,
                "insurance.dask.needBody",
                "Under Türkiye’s disaster insurance legislation, privately owned residential premises and independent sections used as commercial premises or offices must have compulsory earthquake insurance (DASK). DASK covers damage caused directly or indirectly by earthquakes, including subsequent fire, explosion, tsunami, and landslide damage to insured buildings."
              )}
            </p>
            <p className="mt-4 text-sm font-medium text-zinc-800 dark:text-zinc-200">{tr(t, "insurance.dask.needListIntro", "DASK provides protection for fundamental building elements:")}</p>
            <ul className="mt-4 flex flex-col gap-2">
              {NEED_LIST_KEYS.map((key) => (
                <li key={key} className="flex gap-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 md:text-base">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-600 text-white">
                    <FiCheck className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
                  </span>
                  <span>{tr(t, key, "")}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-base">
              {tr(
                t,
                "insurance.dask.needClosing",
                "You can start the policy process quickly with your DASK (UAVT) address code or by searching with your full address — our team at İlsa Insurance will guide you through the steps."
              )}
            </p>
          </div>
        </section>

        <section
          id="coverage"
          className="scroll-mt-32 border-b border-zinc-200/90 bg-zinc-100 py-14 transition-colors duration-300 dark:border-white/10 dark:bg-black"
        >
          <div className="mx-auto max-w-[800px] px-4">
            <h2 className={`text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.dask.coverTitle", "What does DASK cover?")}
            </h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-300 md:text-lg">{tr(t, "insurance.dask.coverLead", "Compulsory earthquake insurance covers the following:")}</p>
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
            <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">{tr(t, "insurance.dask.coverFootnote", "")}</p>
          </div>
        </section>

        <section
          id="difference"
          className="scroll-mt-32 border-b border-zinc-200/90 bg-white py-14 transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950"
        >
          <div className="mx-auto max-w-[800px] px-4">
            <h2 className={`text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.dask.diffTitle", "The difference between DASK and home insurance")}
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-base">
              {tr(t, "insurance.dask.diffP1", "DASK only covers earthquake and earthquake-related damage to the insured building.")}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-base">
              {tr(
                t,
                "insurance.dask.diffP2",
                "Home insurance can also cover fire, flood, theft, and many other risks, including contents. For the most comprehensive protection, both policies are usually recommended together."
              )}
            </p>
          </div>
        </section>

        <section
          id="guarantees"
          className="scroll-mt-32 border-b border-zinc-200/90 bg-zinc-100 py-14 transition-colors duration-300 dark:border-white/10 dark:bg-black"
        >
          <div className="mx-auto max-w-[960px] px-4">
            <h2 className={`text-center text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.dask.compareTitle", "Guarantees at a glance")}
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-base">
              {tr(
                t,
                "insurance.dask.compareLead",
                "Protect your building against earthquake damage and related disasters such as fire, explosion, tsunami, and landslide with compulsory earthquake insurance (DASK). Combine with home insurance when you need contents and wider perils."
              )}
            </p>
            <div className="mt-10 overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-950">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200/80 bg-zinc-100 dark:border-white/10 dark:bg-zinc-900">
                    <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">{tr(t, "insurance.dask.compareColGuarantee", "Coverage")}</th>
                    <th className="px-4 py-3 text-center font-semibold text-zinc-900 dark:text-zinc-100">
                      {tr(t, "insurance.dask.compareColDask", "DASK (compulsory)")}
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-zinc-900 dark:text-zinc-100">
                      {tr(t, "insurance.dask.compareColHome", "Home insurance")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-100 bg-white dark:border-white/10 dark:bg-transparent">
                    <td className="px-4 py-4 text-zinc-700 dark:text-zinc-200">
                      {tr(
                        t,
                        "insurance.dask.compareRow1Label",
                        "Earthquake and earthquake-related structural damage (as defined in the policy)"
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <CellCovered t={t} yes />
                    </td>
                    <td className="px-4 py-4">
                      <CellCovered t={t} yes />
                    </td>
                  </tr>
                  <tr className="border-b border-zinc-100 bg-zinc-50/70 dark:border-white/10 dark:bg-white/[0.03]">
                    <td className="px-4 py-4 text-zinc-700 dark:text-zinc-200">
                      {tr(t, "insurance.dask.compareRow2Label", "Household contents and wider non-earthquake perils")}
                    </td>
                    <td className="px-4 py-4">
                      <CellCovered t={t} yes={false} />
                    </td>
                    <td className="px-4 py-4">
                      <CellCovered t={t} yes />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mx-auto mt-4 max-w-3xl text-center text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              {tr(t, "insurance.dask.compareFootnote", "Illustrative comparison — exact guarantees depend on your DASK schedule and the home policy you choose.")}
            </p>
          </div>
        </section>

        <section
          id="pricing"
          className="scroll-mt-32 border-b border-zinc-200/90 bg-white py-14 transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950"
        >
          <div className="mx-auto max-w-[800px] px-4">
            <h2 className={`text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.dask.pricingTitle", "How are DASK premiums determined?")}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-base">{tr(t, "insurance.dask.pricingIntro", "Premiums are calculated using criteria such as:")}</p>
            <ul className="mt-6 flex flex-col gap-3">
              {PRICING_BULLET_KEYS.map((key) => (
                <li key={key} className="flex gap-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 md:text-base">
                  <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-brand-600" aria-hidden />
                  <span>{tr(t, key, "")}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-base">
              {tr(
                t,
                "insurance.dask.calcBody",
                "Across insurers the same DASK tariff principles apply. The insured location is identified with the UAVT address code, and the earthquake risk zone of that address is one of the main price drivers together with construction type and gross area."
              )}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-base">
              {tr(
                t,
                "insurance.dask.calcClosing",
                "To obtain an indicative premium you need your property’s UAVT address code or the full address so the building can be matched to the correct risk band."
              )}
            </p>
          </div>
        </section>

        <section className="border-b border-zinc-200/90 bg-zinc-100 py-14 transition-colors duration-300 dark:border-white/10 dark:bg-black">
          <div className="mx-auto max-w-[1440px] px-4">
            <h2 className={`text-center text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.dask.whyTitle", "Why İlsa Insurance?")}
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

        <InsurancePartnerCompaniesSection />

        <section
          id="faq"
          className="scroll-mt-32 border-b border-zinc-200/90 bg-white py-14 transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950"
        >
          <div className="mx-auto grid max-w-[1200px] gap-10 px-4 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <h2 className={`text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
                {tr(t, "insurance.dask.faqSectionTitle", "Frequently asked questions")}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-base">{tr(t, "insurance.dask.faqSectionLead", "")}</p>
              <button
                type="button"
                className="mt-6 inline-flex items-center justify-center rounded-full border-2 border-brand-600 px-5 py-2.5 text-sm font-semibold text-brand-600 transition hover:bg-brand-600 hover:text-white dark:border-brand-400 dark:text-brand-400 dark:hover:bg-brand-500 dark:hover:text-white"
                onClick={() => {
                  setFaqExpanded(true);
                  document.getElementById("dask-faq-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                {tr(t, "insurance.dask.faqAllQuestions", "All questions")}
              </button>
            </div>
            <div className="lg:col-span-8" id="dask-faq-list">
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
                        <span className={`text-base font-semibold text-zinc-900 dark:text-white sm:text-lg`}>{tr(t, item.q, "")}</span>
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
                    {tr(t, faqExpanded ? "insurance.dask.faqSeeLess" : "insurance.dask.faqSeeMore", "See more questions")}
                    {faqExpanded ? <FiChevronUp className="h-4 w-4" aria-hidden /> : <FiChevronDown className="h-4 w-4" aria-hidden />}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section
          id="documents"
          className="scroll-mt-32 border-b border-zinc-200/90 bg-zinc-100 py-14 transition-colors duration-300 dark:border-white/10 dark:bg-black"
        >
          <div className="mx-auto max-w-[800px] px-4 text-center">
            <h2 className={`text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl`}>
              {tr(t, "insurance.dask.docsTitle", "Compulsory earthquake insurance — related documents")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-600 dark:text-zinc-300 md:text-base">{tr(t, "insurance.dask.docsLead", "")}</p>
            <InsuranceDocumentLinks rows={DOC_ROWS} downloadLabelKey="insurance.dask.docDownload" />
          </div>
        </section>

        <ExpertReviewsCarousel />

        <section
          id="contact-quote"
          className="scroll-mt-14 bg-brand-600 py-14 transition-colors duration-300 dark:bg-black lg:scroll-mt-16"
        >
          <div className="mx-auto max-w-[1440px] px-4 text-center">
            <h2 className={`text-2xl font-bold text-white md:text-3xl`}>
              {tr(t, "insurance.dask.bottomCtaTitle", "Need a DASK policy or renewal?")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/90 dark:text-white/85">
              {tr(t, "insurance.dask.bottomCtaBody", "Contact İlsa Insurance for a fast quotation and help with UAVT address details.")}
            </p>
            <a
              href="#contact-quote"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-lg shadow-brand-900/20 ring-1 ring-white/30 transition hover:bg-brand-50 hover:shadow-xl dark:bg-zinc-100 dark:text-zinc-950 dark:shadow-black/40 dark:ring-white/20 dark:hover:bg-white"
            >
              {tr(t, "insurance.dask.bottomCtaButton", "Contact us")}
              <FiArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </InsuranceScrollMain>

      <SiteFooter />
    </div>
  );
}
