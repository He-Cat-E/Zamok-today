"use client";

import { useT } from "@/i18n/I18nProvider";
import { recoleta } from "@/theme/fonts";

export function HeroTitle() {
  const t = useT();
  return (
    <div className={`${recoleta.className} text-3xl font-semibold tracking-tight md:text-5xl`}>
      {t("hero.title")}
    </div>
  );
}

