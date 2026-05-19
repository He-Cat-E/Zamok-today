"use client";

import styles from "./AuthShell.module.css";
import { useT } from "@/i18n/I18nProvider";

export type AuthMethod = "email" | "phone";

export function AuthMethodTabs({
  value,
  onChange
}: {
  value: AuthMethod;
  onChange: (method: AuthMethod) => void;
}) {
  const t = useT();

  return (
    <div className={styles.methodTabs} role="tablist" aria-label={t("auth.methodTabsLabel")}>
      <button
        type="button"
        role="tab"
        aria-selected={value === "email"}
        className={[styles.methodTab, value === "email" ? styles.methodTabActive : ""]
          .filter(Boolean)
          .join(" ")}
        onClick={() => onChange("email")}
      >
        {t("auth.tab.email")}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={value === "phone"}
        className={[styles.methodTab, value === "phone" ? styles.methodTabActive : ""]
          .filter(Boolean)
          .join(" ")}
        onClick={() => onChange("phone")}
      >
        {t("auth.tab.phone")}
      </button>
    </div>
  );
}

