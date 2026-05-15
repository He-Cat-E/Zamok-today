"use client";

import { useT } from "@/i18n/I18nProvider";

export function HeroTitle() {
  const t = useT();
  return (
    <div className={`text-3xl font-semibold tracking-tight md:text-5xl`}>
      {t("hero.title")}
    </div>
  );
}

