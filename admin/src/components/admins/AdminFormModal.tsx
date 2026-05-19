"use client";

import { useEffect, useMemo, useState } from "react";
import { FiX } from "react-icons/fi";
import { PasswordField } from "@/components/ui/PasswordField";
import { ADMIN_PAGES, type AdminPageKey } from "@/config/adminPages";
import {
  createAdminAccount,
  updateAdminAccount,
  type AdminAccountRow
} from "@/lib/adminApi";
import { useT } from "@/i18n/I18nProvider";

type AdminFormModalProps = {
  mode: "create" | "edit";
  admin?: AdminAccountRow | null;
  onClose: () => void;
  onSaved: () => void;
};

const inputClass =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-brand-500 focus:ring-2 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100";

export function AdminFormModal({ mode, admin, onClose, onSaved }: AdminFormModalProps) {
  const t = useT();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [permissions, setPermissions] = useState<AdminPageKey[]>(["dashboard"]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const labels = useMemo(
    () => ({
      createTitle: t("admins.form.createTitle"),
      editTitle: t("admins.form.editTitle"),
      fullName: t("page.profile.fullName"),
      email: t("table.email"),
      password: t("login.password"),
      passwordHint: t("admins.form.passwordHint"),
      pages: t("admins.form.pagesLabel"),
      save: t("admins.form.save"),
      create: t("admins.actions.create"),
      cancel: t("common.cancel"),
      close: t("users.wallet.close"),
      wait: t("login.wait"),
      selectOnePage: t("admins.form.selectOnePage")
    }),
    [t]
  );

  useEffect(() => {
    if (mode === "edit" && admin) {
      setFullName(admin.fullName || "");
      setEmail(admin.email || "");
      setPassword("");
      setPermissions((admin.permissions || ["dashboard"]) as AdminPageKey[]);
    } else {
      setFullName("");
      setEmail("");
      setPassword("");
      setPermissions(["dashboard"]);
    }
    setError(null);
  }, [admin, mode]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !busy) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onClose]);

  function togglePage(key: AdminPageKey) {
    setPermissions((prev) => {
      if (prev.includes(key)) {
        const next = prev.filter((k) => k !== key);
        return next.length ? next : prev;
      }
      return [...prev, key];
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (permissions.length === 0) {
      setError(labels.selectOnePage);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      if (mode === "create") {
        await createAdminAccount({
          fullName: fullName.trim(),
          email: email.trim(),
          password,
          permissions
        });
      } else if (admin) {
        await updateAdminAccount(admin.id, {
          fullName: fullName.trim(),
          permissions
        });
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : labels.save);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="zt-modal-backdrop"
      role="presentation"
      onClick={(e) => {
        if (!busy && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="zt-modal zt-admin-form-modal"
        style={{ width: "min(100%, 32rem)" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-form-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="zt-modal-header">
          <h2 id="admin-form-title" className="zt-modal-title">
            {mode === "create" ? labels.createTitle : labels.editTitle}
          </h2>
          <button
            type="button"
            className="zt-modal-close"
            onClick={onClose}
            disabled={busy}
            aria-label={labels.close}
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)}>
          <div className="zt-modal-body space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {labels.fullName}
              </span>
              <input
                type="text"
                className={inputClass}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                maxLength={80}
                disabled={busy}
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {labels.email}
              </span>
              <input
                type="email"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={busy || mode === "edit"}
                readOnly={mode === "edit"}
              />
            </label>

            {mode === "create" ? (
              <PasswordField
                id="admin-create-password"
                label={labels.password}
                value={password}
                onChange={setPassword}
                autoComplete="new-password"
                disabled={busy}
                required
                minLength={8}
                hint={labels.passwordHint}
                inputClassName={inputClass}
              />
            ) : null}

            <fieldset>
              <legend className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {labels.pages}
              </legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {ADMIN_PAGES.map(({ key, labelKey }) => (
                  <label
                    key={key}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700"
                  >
                    <input
                      type="checkbox"
                      className="rounded border-zinc-300 text-brand-600 focus:ring-brand-500"
                      checked={permissions.includes(key)}
                      onChange={() => togglePage(key)}
                      disabled={busy}
                    />
                    <span>{t(labelKey)}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {error ? (
              <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                {error}
              </p>
            ) : null}
          </div>

          <div className="zt-confirm-footer">
            <button
              type="button"
              className="zt-confirm-btn zt-confirm-btn--ghost"
              onClick={onClose}
              disabled={busy}
            >
              {labels.cancel}
            </button>
            <button
              type="submit"
              className="zt-confirm-btn zt-confirm-btn--primary"
              disabled={busy}
            >
              {busy ? labels.wait : mode === "create" ? labels.create : labels.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
