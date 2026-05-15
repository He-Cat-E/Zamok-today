"use client";

import Link from "next/link";
import { FaInstagram, FaTelegram, FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import { useT } from "@/i18n/I18nProvider";
import { HEADER_FOOTER_NAV, insuranceNavItems } from "@/lib/siteNavConfig";

const MEP_FUTURE_DESIGN_URL = "https://mepfuturedesign.com/";

const CONTACT_EMAIL = "info@zamok.com.tr";
const CONTACT_PHONE_DISPLAY = "+90 0312 911 2762";
const CONTACT_PHONE_TEL = "+903129112762";
const CONTACT_LOCATION = "Ankara / Türkiye";

const SOCIAL = {
  instagram: "https://www.instagram.com/zamok.tr",
  x: "https://x.com/zamoktr",
  whatsapp: `https://chat.whatsapp.com/D0NkRA9mkKf9OkFW4r66JI`,
  telegram: "https://t.me/+w1cTI49m_qVjZmE8"
} as const;

const linkClass =
  "block text-sm font-medium text-zinc-700 transition hover:text-brand-600 dark:text-zinc-300 dark:hover:text-brand-400";

function FooterNavLink({ href, label }: { href: string; label: string }) {
  if (href === "#") {
    return (
      <a href="#" className={linkClass}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={linkClass}>
      {label}
    </Link>
  );
}

function ZAMOKWordmark() {
  return (
    <div
      className="flex select-none items-center justify-center gap-[0.06em] text-[clamp(2.75rem,10vw,4.5rem)] font-extrabold uppercase leading-none tracking-[0.08em] text-brand-600 lg:text-[300px]"
      aria-label="ZAMOK"
    >
      {"ZAMOK".split("").map((ch, i) => (
        <span key={`zam-${i}`} className="inline-block">
          {ch}
        </span>
      ))}
    </div>
  );
}

export function SiteFooter() {
  const t = useT();
  const year = new Date().getFullYear();

  const insuranceItems = insuranceNavItems();
  const insuranceMid = Math.ceil(insuranceItems.length / 2);
  const insuranceLeft = insuranceItems.slice(0, insuranceMid);
  const insuranceRight = insuranceItems.slice(insuranceMid);

  const resourceLinks = [
    { href: "#", labelKey: "footer.about" },
    { href: "#", labelKey: "footer.newsroom" },
    { href: "#", labelKey: "footer.privacy" },
    { href: "#", labelKey: "footer.cookies" }
  ];

  const headingClass =
    "mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500 dark:text-zinc-500";

  return (
    <footer className="border-t border-zinc-200/90 bg-zinc-50 dark:border-white/10 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-[1640px] px-6 pb-12 pt-14 md:px-10 md:pb-16 md:pt-16">
        <div className="flex justify-center pb-10 md:pb-12">
          <ZAMOKWordmark />
        </div>

        <div className="border-t border-zinc-200/90 pt-10 dark:border-white/10 md:pt-12">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-10">
            <div className="lg:col-span-3">
              <h3 className={headingClass}>{t("footer.col.primary")}</h3>
              <ul className="flex flex-col gap-2.5">
                {HEADER_FOOTER_NAV.map((item) => (
                  <li key={item.labelKey}>
                    <FooterNavLink href={item.href} label={t(item.labelKey)} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5">
              <h3 className={headingClass}>{t("footer.col.insurance")}</h3>
              <div className="grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
                <ul className="flex flex-col gap-2.5">
                  {insuranceLeft.map((item) => (
                    <li key={item.labelKey}>
                      <FooterNavLink href={item.href} label={t(item.labelKey)} />
                    </li>
                  ))}
                </ul>
                <ul className="flex flex-col gap-2.5">
                  {insuranceRight.map((item) => (
                    <li key={item.labelKey}>
                      <FooterNavLink href={item.href} label={t(item.labelKey)} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-2">
              <h3 className={headingClass}>{t("footer.col.resources")}</h3>
              <ul className="flex flex-col gap-2.5">
                {resourceLinks.map((item) => (
                  <li key={item.labelKey}>
                    <a href={item.href} className={linkClass}>
                      {t(item.labelKey)}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-6 max-w-xs text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                {t("footer.disclaimer")}
              </p>
            </div>

            <div className="lg:col-span-2">
              <h3 className={headingClass}>{t("footer.col.contact")}</h3>
              <ul className="flex flex-col gap-3 text-sm text-zinc-800 dark:text-zinc-200">
                <li>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="font-medium transition hover:text-brand-600 dark:hover:text-brand-400"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${CONTACT_PHONE_TEL}`}
                    className="font-medium transition hover:text-brand-600 dark:hover:text-brand-400"
                  >
                    {CONTACT_PHONE_DISPLAY}
                  </a>
                </li>
                <li className="text-zinc-600 dark:text-zinc-400">{CONTACT_LOCATION}</li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={SOCIAL.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 text-zinc-600 transition hover:border-brand-500/50 hover:text-brand-600 dark:border-white/20 dark:text-zinc-300 dark:hover:border-brand-400/40 dark:hover:text-brand-400"
                  aria-label={t("footer.social.instagram")}
                >
                  <FaInstagram className="h-[18px] w-[18px]" />
                </a>
                <a
                  href={SOCIAL.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 text-zinc-600 transition hover:border-brand-500/50 hover:text-brand-600 dark:border-white/20 dark:text-zinc-300 dark:hover:border-brand-400/40 dark:hover:text-brand-400"
                  aria-label={t("footer.social.x")}
                >
                  <FaXTwitter className="h-[17px] w-[17px]" />
                </a>
                <a
                  href={SOCIAL.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 text-zinc-600 transition hover:border-brand-500/50 hover:text-brand-600 dark:border-white/20 dark:text-zinc-300 dark:hover:border-brand-400/40 dark:hover:text-brand-400"
                  aria-label={t("footer.social.whatsapp")}
                >
                  <FaWhatsapp className="h-[18px] w-[18px]" />
                </a>
                <a
                  href={SOCIAL.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 text-zinc-600 transition hover:border-brand-500/50 hover:text-brand-600 dark:border-white/20 dark:text-zinc-300 dark:hover:border-brand-400/40 dark:hover:text-brand-400"
                  aria-label={t("footer.social.telegram")}
                >
                  <FaTelegram className="h-[18px] w-[18px]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200/80 bg-zinc-100/90 py-4 text-center text-[11px] leading-relaxed text-zinc-600 dark:border-white/10 dark:bg-black dark:text-zinc-400">
        <div className="mx-auto max-w-[1440px] px-6">
          <p>
            <span>© {year}</span>{" "}
            <a
              href={MEP_FUTURE_DESIGN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-zinc-400 underline-offset-2 transition hover:text-brand-600 dark:decoration-zinc-500 dark:hover:text-brand-400"
            >
              {t("footer.mepCompanyName")}
            </a>
            {" · "}
            {t("footer.allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}
