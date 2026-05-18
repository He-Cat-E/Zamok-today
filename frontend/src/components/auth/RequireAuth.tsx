"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useT } from "@/i18n/I18nProvider";
import { useAppSelector } from "@/store/hooks";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const t = useT();
  const router = useRouter();
  const status = useAppSelector((s) => s.auth.status);

  useEffect(() => {
    if (status === "anonymous") {
      router.replace("/login");
    }
  }, [router, status]);

  if (status === "idle" || status === "loading") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
        {t("auth.pleaseWait")}
      </div>
    );
  }

  if (status !== "authenticated") {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">{t("account.signInRequired")}</p>
        <Link
          href="/login"
          className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          {t("auth.signIn")}
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
