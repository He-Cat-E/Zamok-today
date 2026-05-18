"use client";

import { Toaster } from "sonner";
import { useTheme } from "@/theme/ThemeProvider";

export function AppToaster() {
  const { resolved } = useTheme();

  return (
    <Toaster
      theme={resolved}
      position="top-right"
      expand={false}
      richColors={false}
      closeButton
      duration={4500}
      toastOptions={{
        classNames: {
          toast:
            "group toast !font-sans !rounded-xl !border !shadow-lg !ring-1 backdrop-blur-sm !bg-white !text-zinc-900 !border-zinc-200/90 !ring-zinc-900/5 dark:!bg-zinc-950 dark:!text-zinc-50 dark:!border-white/10 dark:!ring-white/10",
          title: "!text-sm !font-semibold",
          description: "!text-sm !text-zinc-600 dark:!text-zinc-300",
          actionButton:
            "!rounded-lg !bg-brand-600 !text-white !font-semibold hover:!bg-brand-700",
          cancelButton:
            "!rounded-lg !bg-zinc-100 !text-zinc-800 dark:!bg-white/10 dark:!text-zinc-100",
          closeButton:
            "!border-zinc-200 !bg-white !text-zinc-500 hover:!bg-zinc-50 dark:!border-white/15 dark:!bg-zinc-900 dark:!text-zinc-300",
          success:
            "!border-emerald-200/90 !bg-emerald-50/95 !text-emerald-950 dark:!border-emerald-500/30 dark:!bg-emerald-950/80 dark:!text-emerald-100",
          error:
            "!border-brand-200/90 !bg-brand-50/95 !text-brand-950 dark:!border-brand-500/35 dark:!bg-brand-950/85 dark:!text-brand-100",
          info: "!border-sky-200/90 !bg-sky-50/95 dark:!border-sky-500/30 dark:!bg-sky-950/80",
          warning: "!border-amber-200/90 !bg-amber-50/95 dark:!border-amber-500/30 dark:!bg-amber-950/80"
        }
      }}
    />
  );
}
