"use client";

import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { I18nProvider } from "@/i18n/I18nProvider";
import { ThemeProvider } from "@/theme/ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AdminAuthProvider>{children}</AdminAuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
