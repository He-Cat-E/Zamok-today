"use client";

import { FiMoon, FiSun } from "react-icons/fi";
import { topbarIconBtn } from "@/components/layout/layoutUi";
import { useTheme } from "@/theme/ThemeProvider";
import { useT } from "@/i18n/I18nProvider";

export function ThemeToggle() {
  const { resolved, toggle } = useTheme();
  const t = useT();
  const isDark = resolved === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className={topbarIconBtn}
      aria-label={isDark ? t("topbar.themeLight") : t("topbar.themeDark")}
      title={isDark ? t("topbar.themeLight") : t("topbar.themeDark")}
    >
      {isDark ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
    </button>
  );
}
