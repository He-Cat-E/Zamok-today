"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiLock, FiMail } from "react-icons/fi";
import { AuthField } from "@/components/auth/AuthField";
import { AuthShell } from "@/components/auth/AuthShell";
import styles from "@/components/auth/AuthShell.module.css";
import { AdminLoadingScreen } from "@/components/loading/AdminLoadingScreen";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useMinLoaderDelay } from "@/hooks/useMinLoaderDelay";
import { useT } from "@/i18n/I18nProvider";
import { readRememberedLogin, saveRememberedLogin } from "@/lib/adminRemember";

export default function AdminLoginPage() {
  const router = useRouter();
  const t = useT();
  const { status, login } = useAdminAuth();
  const minLoaderDone = useMinLoaderDelay();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = readRememberedLogin();
    setEmail(saved.email);
    setRememberMe(saved.remember);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (status === "authenticated" && minLoaderDone) {
      router.replace("/dashboard");
    }
  }, [status, router, minLoaderDone]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password, rememberMe);
      saveRememberedLogin(rememberMe, email);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (!minLoaderDone || status === "loading" || status === "authenticated") {
    return <AdminLoadingScreen />;
  }

  if (!hydrated) {
    return <AdminLoadingScreen />;
  }

  return (
    <AuthShell subtitle={t("login.subtitle")}>
      <form onSubmit={onSubmit}>
        {error ? <p className={styles.error}>{error}</p> : null}
        <AuthField
          id="admin-email"
          label={t("login.emailLabel")}
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="admin@zamok.today"
          icon={FiMail}
          autoComplete="email"
        />
        <AuthField
          id="admin-password"
          label={t("login.passwordLabel")}
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          icon={FiLock}
          autoComplete="current-password"
          showToggle
          visible={showPw}
          onToggleVisible={() => setShowPw((v) => !v)}
        />
        <div className={styles.rememberRow}>
          <label className={styles.remember}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            {t("login.rememberMe")}
          </label>
        </div>
        <button type="submit" className={styles.submit} disabled={submitting}>
          {submitting ? t("login.wait") : t("login.submit")}
        </button>
      </form>
    </AuthShell>
  );
}
