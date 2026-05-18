"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiLock, FiMail } from "react-icons/fi";
import { AuthField } from "@/components/auth/AuthField";
import { AuthShell } from "@/components/auth/AuthShell";
import styles from "@/components/auth/AuthShell.module.css";
import { useT } from "@/i18n/I18nProvider";
import { toast } from "@/lib/toast";
import { useAppDispatch } from "@/store/hooks";
import { clearAuthError, loginUser } from "@/store/authSlice";

export default function LoginPage() {
  const t = useT();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    dispatch(clearAuthError());
    setSubmitting(true);
    const result = await dispatch(loginUser({ identifier, password, rememberMe }));
    setSubmitting(false);
    if (loginUser.fulfilled.match(result)) {
      toast.success(t("toast.auth.loginSuccess"));
      router.replace("/");
      return;
    }
    toast.error(typeof result.payload === "string" ? result.payload : t("auth.error.generic"));
  }

  return (
    <AuthShell
      subtitle={t("auth.login.subtitle")}
      footer={
        <>
          {t("auth.noAccount")}{" "}
          <Link href="/register" className={styles.link}>
            {t("auth.createAccount")}
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit}>
        <AuthField
          id="login-identifier"
          label={t("auth.email")}
          type="email"
          value={identifier}
          onChange={setIdentifier}
          placeholder={t("auth.emailPlaceholder")}
          icon={FiMail}
          autoComplete="email"
        />
        <AuthField
          id="login-password"
          label={t("auth.password")}
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          icon={FiLock}
          autoComplete="current-password"
          showToggle
          visible={showPw}
          onToggleVisible={() => setShowPw((v) => !v)}
        />
        <div className={styles.rowBetween}>
          <label className={styles.remember}>
            <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
            {t("auth.rememberMe")}
          </label>
          <Link href="/forgot-password" className={styles.link}>
            {t("auth.forgotPassword")}
          </Link>
        </div>
        <button type="submit" className={styles.submit} disabled={submitting}>
          {submitting ? t("auth.pleaseWait") : t("auth.submit.continue")}
        </button>
      </form>
    </AuthShell>
  );
}
