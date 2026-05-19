"use client";

import { useEffect, useState } from "react";
import { OtpDigitInput } from "@/components/auth/OtpDigitInput";
import { PhoneNumberField } from "@/components/auth/PhoneNumberField";
import styles from "@/components/auth/AuthShell.module.css";
import { buildE164Digits } from "@/lib/phone";
import { isAuthApiError } from "@/lib/authErrors";
import { useT } from "@/i18n/I18nProvider";
import { toast } from "@/lib/toast";
import * as authApi from "@/lib/authApi";
import { useAppSelector } from "@/store/hooks";

const RESEND_SECONDS = 60;

export function PhoneOtpForm({
  purpose,
  fullName,
  onSuccess
}: {
  purpose: "login" | "register";
  fullName?: string;
  onSuccess: (user: authApi.AuthUser, meta?: { existingAccount?: boolean }) => void;
}) {
  const t = useT();
  const localeCountry = useAppSelector((s) => s.locale.country);
  const [country, setCountry] = useState(() =>
    String(localeCountry || "TR")
      .trim()
      .toUpperCase()
  );
  const [national, setNational] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [phoneAlreadyRegistered, setPhoneAlreadyRegistered] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const id = window.setInterval(() => {
      setResendIn((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [resendIn]);

  function showError(err: unknown) {
    if (isAuthApiError(err) && err.code === "PHONE_NOT_FOUND") {
      toast.error(t("auth.phoneNotFound"));
      return;
    }
    if (isAuthApiError(err) && err.code === "ACCOUNT_SUSPENDED") {
      toast.error(t("auth.accountSuspended"));
      return;
    }
    toast.error(err instanceof Error ? err.message : t("auth.error.generic"));
  }

  function validatePhone() {
    const e164 = buildE164Digits(country, national);
    if (!e164) {
      toast.error(t("auth.phoneInvalid"));
      return null;
    }
    return e164;
  }

  async function sendCode() {
    if (!validatePhone()) return;
    setSending(true);
    try {
      const res = await authApi.authPhoneSendCode({ country, phone: national, purpose });
      setCodeSent(true);
      setResendIn(RESEND_SECONDS);
      if (res.existingAccount) {
        setPhoneAlreadyRegistered(true);
        toast.info(t("toast.auth.phoneExistingSignIn"));
      } else {
        setPhoneAlreadyRegistered(false);
        toast.success(t("toast.auth.verificationSent"));
      }
      if (res.devOtp) {
        setCode(res.devOtp.replace(/\D/g, "").slice(0, 6));
        toast.info(t("toast.auth.devOtpCode"), { duration: 12_000 });
      }
    } catch (e) {
      showError(e);
    } finally {
      setSending(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!codeSent) {
      await sendCode();
      return;
    }
    if (purpose === "register" && (!fullName || fullName.trim().length < 2)) {
      toast.error(t("auth.fullNameRequired"));
      return;
    }
    if (!validatePhone()) return;
    if (code.length !== 6) {
      toast.error(t("auth.verificationCodeIncomplete"));
      return;
    }
    setSubmitting(true);
    try {
      if (purpose === "login") {
        const { user } = await authApi.authPhoneLogin({ country, phone: national, code });
        onSuccess(user);
      } else {
        const res = await authApi.authPhoneRegister({
          fullName: fullName?.trim() || "",
          country,
          phone: national,
          code
        });
        onSuccess(res.user, {
          existingAccount: res.existingAccount ?? phoneAlreadyRegistered
        });
      }
    } catch (e) {
      showError(e);
    } finally {
      setSubmitting(false);
    }
  }

  const primaryLabel = !codeSent
    ? sending
      ? t("auth.pleaseWait")
      : t("auth.sendCode")
    : submitting
      ? t("auth.pleaseWait")
      : phoneAlreadyRegistered || purpose === "login"
        ? t("auth.submit.continue")
        : t("auth.submit.register");

  return (
    <form onSubmit={onSubmit}>
      {codeSent ? <p className={styles.codeHint}>{t("auth.codeSent")}</p> : null}
      <PhoneNumberField
        id={`phone-${purpose}`}
        country={country}
        national={national}
        onCountryChange={setCountry}
        onNationalChange={setNational}
        disabled={codeSent}
      />
      {codeSent ? (
        <OtpDigitInput
          id={`otp-${purpose}`}
          label={t("auth.verificationCodeLabel")}
          value={code}
          onChange={setCode}
          disabled={submitting}
        />
      ) : null}
      {codeSent ? (
        <div className={styles.resendRow}>
          <button
            type="button"
            className={styles.linkButton}
            disabled={resendIn > 0 || sending}
            onClick={() => void sendCode()}
          >
            {resendIn > 0
              ? t("auth.resendCodeIn").replace("{seconds}", String(resendIn))
              : t("auth.resendCode")}
          </button>
        </div>
      ) : null}
      <button type="submit" className={styles.submit} disabled={sending || submitting}>
        {primaryLabel}
      </button>
    </form>
  );
}
