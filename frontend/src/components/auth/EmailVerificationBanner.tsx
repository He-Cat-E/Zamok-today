"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiMail } from "react-icons/fi";
import { useT } from "@/i18n/I18nProvider";
import { toast } from "@/lib/toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resendVerificationEmail } from "@/store/authSlice";

const HIDDEN_PREFIXES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/profile",
  "/wallet"
];

function needsVerification(user: { emailVerified?: boolean } | null) {
  return user?.emailVerified === false;
}

export function EmailVerificationBanner() {
  const t = useT();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const status = useAppSelector((s) => s.auth.status);
  const [sending, setSending] = useState(false);

  if (status !== "authenticated" || !user || !needsVerification(user)) return null;
  if (pathname && HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null;
  }

  async function onResend() {
    setSending(true);
    const result = await dispatch(resendVerificationEmail());
    setSending(false);
    if (resendVerificationEmail.fulfilled.match(result)) {
      toast.success(t("toast.auth.verificationSent"));
      if (result.payload.verifyUrl) {
        sessionStorage.setItem("zamok_dev_verify_url", result.payload.verifyUrl);
        toast.info(t("toast.auth.devVerifyLink"), { duration: 12_000 });
      }
      return;
    }
    toast.error(typeof result.payload === "string" ? result.payload : t("auth.error.generic"));
  }

  return (
    <div
      role="status"
      className="border-b border-brand-200/80 bg-brand-50/95 text-brand-950 dark:border-white/10 dark:bg-black dark:text-zinc-100"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-center gap-x-3 gap-y-2 px-4 py-2.5 text-center text-sm sm:justify-between sm:text-left">
        <p className="inline-flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 font-medium sm:justify-start">
          <FiMail className="shrink-0 text-brand-600 dark:text-zinc-300" aria-hidden />
          <span className="dark:text-zinc-200">{t("auth.verify.banner")}</span>
          <span className="font-semibold text-brand-800 dark:text-white">{user.email}</span>
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => void onResend()}
            disabled={sending}
            className="rounded-full bg-brand-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            {sending ? t("auth.pleaseWait") : t("auth.verify.resend")}
          </button>
          <Link
            href="/verify-email"
            className="rounded-full border border-brand-300/80 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-brand-800 hover:bg-white dark:border-white/20 dark:bg-transparent dark:text-white dark:hover:bg-white/10"
          >
            {t("auth.verify.openPage")}
          </Link>
        </div>
      </div>
    </div>
  );
}
