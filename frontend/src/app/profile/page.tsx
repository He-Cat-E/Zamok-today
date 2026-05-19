"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiCreditCard, FiLock, FiMail, FiSmartphone, FiUser } from "react-icons/fi";
import { AccountPageShell } from "@/components/account/AccountPageShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { ProfileIdScanModal } from "@/components/profile/ProfileIdScanModal";
import type { DetectedPersonalData } from "@/lib/profileApi";
import { userInitials } from "@/lib/authApi";
import {
  formatUserPhone,
  hasEmail,
  hasPhone,
  isPhoneAuthUser,
  profilePrimaryContact
} from "@/lib/profileDisplay";
import { useT } from "@/i18n/I18nProvider";
import { toast } from "@/lib/toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resendVerificationEmail, updateProfile } from "@/store/authSlice";

const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-3 text-sm text-zinc-900 outline-none ring-brand-600/30 focus:border-brand-500 focus:ring-2 dark:border-white/15 dark:bg-black dark:text-white dark:focus:border-white/30";

const readOnlyFieldClass =
  "flex min-h-[42px] w-full items-center rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 dark:border-white/10 dark:bg-zinc-900/60 dark:text-white";

function ProfileContent() {
  const t = useT();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user)!;
  const [fullName, setFullName] = useState(user.fullName);
  const [saving, setSaving] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);
  const [scanSaving, setScanSaving] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    setFullName(user.fullName);
  }, [user.fullName]);

  const phoneAuth = isPhoneAuthUser(user);
  const phoneDisplay = hasPhone(user) ? formatUserPhone(user.phone!) : "";
  const emailDisplay = hasEmail(user) ? user.email.trim() : "";
  const contactLine = profilePrimaryContact(user);

  const emailVerified = user.emailVerified !== false;
  const phoneVerified = user.phoneVerified !== false;
  const showEmailVerify = !phoneAuth && hasEmail(user) && !emailVerified;
  const showPhoneRow = phoneAuth || hasPhone(user);
  const showEmailRow = !phoneAuth || hasEmail(user);

  const nationalId = user.nationalId || "";
  const dateOfBirth = user.dateOfBirth || "";

  const profileDirty = fullName.trim() !== user.fullName.trim();

  const verifiedBadge = phoneAuth
    ? {
        ok: phoneVerified,
        label: phoneVerified ? t("profile.phoneVerified") : t("profile.phoneNotVerified"),
        Icon: phoneVerified ? FiCheckCircle : FiSmartphone
      }
    : {
        ok: emailVerified,
        label: emailVerified ? t("profile.emailVerified") : t("profile.emailNotVerified"),
        Icon: emailVerified ? FiCheckCircle : FiMail
      };
  const VerifiedIcon = verifiedBadge.Icon;
  const signInMethodLabel = phoneAuth
    ? t("profile.signInMethodPhone")
    : t("profile.signInMethodEmail");

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const result = await dispatch(updateProfile({ fullName }));
    setSaving(false);
    if (updateProfile.fulfilled.match(result)) {
      toast.success(t("profile.saved"));
      return;
    }
    toast.error(typeof result.payload === "string" ? result.payload : t("auth.error.generic"));
  }

  async function onSaveIdScan(data: DetectedPersonalData) {
    setScanSaving(true);
    const result = await dispatch(
      updateProfile({
        fullName: user.fullName,
        nationalId: data.nationalId || nationalId,
        dateOfBirth: data.dateOfBirth || dateOfBirth
      })
    );
    setScanSaving(false);
    if (updateProfile.fulfilled.match(result)) {
      toast.success(t("profile.scanSaved"));
      setScanOpen(false);
      return;
    }
    toast.error(typeof result.payload === "string" ? result.payload : t("auth.error.generic"));
  }

  async function onResendVerify() {
    setResending(true);
    const result = await dispatch(resendVerificationEmail());
    setResending(false);
    if (resendVerificationEmail.fulfilled.match(result)) {
      toast.success(t("toast.auth.verificationSent"));
      return;
    }
    toast.error(typeof result.payload === "string" ? result.payload : t("auth.error.generic"));
  }

  return (
    <AccountPageShell title={t("profile.title")} subtitle={t("profile.subtitle")}>
      <ProfileIdScanModal
        open={scanOpen}
        onClose={() => !scanSaving && setScanOpen(false)}
        onSave={onSaveIdScan}
        saving={scanSaving}
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="overflow-hidden rounded-2xl border border-brand-200/80 bg-white text-center shadow-sm ring-1 ring-brand-600/10 dark:border-brand-500/25 dark:bg-zinc-950 dark:ring-brand-500/15">
          <div className="h-1 bg-brand-600" aria-hidden />
          <div className="p-6">
            <span className="relative mx-auto grid h-20 w-20 place-items-center overflow-hidden rounded-full border-2 border-brand-600 bg-brand-50 text-2xl font-bold text-brand-600 dark:border-brand-500 dark:bg-brand-950/50 dark:text-brand-300">
              {user.avatarUrl ? (
                <Image src={user.avatarUrl} alt="" width={80} height={80} className="h-full w-full object-cover" />
              ) : (
                userInitials(user)
              )}
            </span>
            <p className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">{user.fullName}</p>
            {contactLine ? (
              <p className="mt-1 truncate text-sm text-zinc-500 dark:text-zinc-400">{contactLine}</p>
            ) : null}
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
              {signInMethodLabel}
            </p>
            <p
              className={[
                "mt-4 inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                verifiedBadge.ok
                  ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : "border border-brand-200/80 bg-brand-50 text-brand-700 dark:border-brand-500/35 dark:bg-brand-950/50 dark:text-brand-200"
              ].join(" ")}
            >
              <VerifiedIcon className="h-3.5 w-3.5" />
              {verifiedBadge.label}
            </p>
          </div>
        </aside>

        <div className="space-y-6">
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm ring-1 ring-zinc-900/5 dark:border-white/10 dark:bg-zinc-950 dark:ring-white/10">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">{t("profile.personalInfo")}</h2>

            <form onSubmit={onSave} className="mt-5 space-y-5">
              <div className="max-w-md">
                <label
                  htmlFor="profile-full-name"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  {t("auth.fullName")}
                </label>
                <div className="relative">
                  <FiUser
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                    aria-hidden
                  />
                  <input
                    id="profile-full-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t("auth.fullNamePlaceholder")}
                    autoComplete="name"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {t("profile.contactDetails")}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                {showEmailRow ? (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {t("auth.email")}
                    </label>
                    <div
                      className={[
                        readOnlyFieldClass,
                        "gap-2",
                        emailDisplay
                          ? "text-zinc-600 dark:text-zinc-300"
                          : "text-zinc-400 dark:text-zinc-500"
                      ].join(" ")}
                    >
                      <FiMail className="h-4 w-4 shrink-0" aria-hidden />
                      <span className="truncate">
                        {emailDisplay || t("profile.emailNotLinked")}
                      </span>
                    </div>
                  </div>
                ) : null}
                {showPhoneRow ? (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {t("profile.phone")}
                    </label>
                    <div
                      className={[
                        readOnlyFieldClass,
                        "gap-2",
                        phoneDisplay
                          ? "text-zinc-600 dark:text-zinc-300"
                          : "text-zinc-400 dark:text-zinc-500"
                      ].join(" ")}
                    >
                      <FiSmartphone className="h-4 w-4 shrink-0" aria-hidden />
                      <span className="truncate">
                        {phoneDisplay || t("profile.phoneNotLinked")}
                      </span>
                    </div>
                  </div>
                ) : null}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {t("profile.nationalId")}
                  </label>
                  <div className={`${readOnlyFieldClass} font-mono`}>
                    <span className={nationalId ? "" : "text-zinc-400 dark:text-zinc-500"}>
                      {nationalId || t("profile.idFieldEmpty")}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{t("profile.idFieldReadOnlyHint")}</p>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {t("profile.dateOfBirth")}
                  </label>
                  <div className={readOnlyFieldClass}>
                    <span className={dateOfBirth ? "" : "text-zinc-400 dark:text-zinc-500"}>
                      {dateOfBirth || t("profile.idFieldEmpty")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between"> 
                <button
                  type="button"
                  onClick={() => setScanOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-800 transition hover:border-brand-400 hover:bg-brand-100 dark:border-brand-500/35 dark:bg-brand-950/40 dark:text-brand-200 dark:hover:bg-brand-950/60"
                >
                  <FiCreditCard className="h-4 w-4 shrink-0" aria-hidden />
                  {t("profile.scanIdButton")}
                </button>
                <button
                  type="submit"
                  disabled={saving || !profileDirty}
                  className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  {saving ? t("auth.pleaseWait") : t("profile.saveChanges")}
                </button>
              </div>
            </form>
          </section>

          {showEmailVerify ? (
            <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 ring-1 ring-zinc-900/5 dark:border-white/10 dark:bg-black dark:ring-white/10">
              <h2 className="text-base font-semibold text-zinc-900 dark:text-white">{t("profile.verifySection")}</h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{t("profile.verifyHint")}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void onResendVerify()}
                  disabled={resending}
                  className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  {resending ? t("auth.pleaseWait") : t("auth.verify.resend")}
                </button>
                <Link
                  href="/verify-email"
                  className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-white dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                >
                  {t("auth.verify.openPage")}
                </Link>
              </div>
            </section>
          ) : null}

          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm ring-1 ring-zinc-900/5 dark:border-white/10 dark:bg-zinc-950 dark:ring-white/10">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">{t("profile.security")}</h2>
            {phoneAuth ? (
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{t("profile.securityPhoneHint")}</p>
            ) : (
              <>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{t("profile.securityHint")}</p>
                <Link
                  href="/forgot-password"
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-white/15 dark:text-white dark:hover:bg-white/5"
                >
                  <FiLock className="h-4 w-4" />
                  {t("profile.changePassword")}
                </Link>
              </>
            )}
          </section>
        </div>
      </div>
    </AccountPageShell>
  );
}

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileContent />
    </RequireAuth>
  );
}
