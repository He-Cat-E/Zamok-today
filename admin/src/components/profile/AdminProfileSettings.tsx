"use client";

import { useEffect, useMemo, useState } from "react";
import { FiCheck, FiLock, FiMail, FiShield, FiUser } from "react-icons/fi";
import { PasswordField } from "@/components/ui/PasswordField";
import { changeAdminPassword, updateAdminProfile } from "@/lib/adminApi";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useT } from "@/i18n/I18nProvider";

type ProfileTab = "general" | "security";

type Flash = { type: "ok" | "err"; text: string } | null;

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function FlashBanner({ flash }: { flash: Flash }) {
  if (!flash) return null;
  return (
    <div
      className={[
        "zt-profile-flash",
        flash.type === "ok" ? "zt-profile-flash--ok" : "zt-profile-flash--err"
      ].join(" ")}
      role="status"
    >
      {flash.type === "ok" ? <FiCheck className="h-4 w-4 shrink-0" aria-hidden /> : null}
      <span>{flash.text}</span>
    </div>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
  wide
}: {
  icon: typeof FiMail;
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div
      className={["zt-profile-info-tile", wide ? "zt-profile-info-tile--wide" : ""]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="zt-profile-info-icon" aria-hidden>
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="zt-profile-info-label">{label}</p>
        <p className="zt-profile-info-value">{value || "—"}</p>
      </div>
    </div>
  );
}

export function AdminProfileSettings() {
  const t = useT();
  const { admin, refresh } = useAdminAuth();
  const [tab, setTab] = useState<ProfileTab>("general");

  const [fullName, setFullName] = useState("");
  const [profileBusy, setProfileBusy] = useState(false);
  const [profileFlash, setProfileFlash] = useState<Flash>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [passwordFlash, setPasswordFlash] = useState<Flash>(null);

  useEffect(() => {
    setFullName(admin?.fullName ?? "");
  }, [admin?.fullName]);

  const roleLabel = useMemo(() => {
    if (!admin) return "";
    return admin.role === "super_admin" ? t("admins.role.superAdmin") : t("admins.role.admin");
  }, [admin, t]);

  const statusLabel = useMemo(() => {
    if (!admin) return "";
    return admin.accountStatus === "suspended"
      ? t("users.accountStatus.suspended")
      : t("users.accountStatus.active");
  }, [admin, t]);

  const isActive = admin?.accountStatus !== "suspended";
  const nameDirty = fullName.trim() !== (admin?.fullName ?? "").trim();

  if (!admin) return null;

  async function onSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileBusy(true);
    setProfileFlash(null);
    try {
      await updateAdminProfile(fullName.trim());
      await refresh();
      setProfileFlash({ type: "ok", text: t("profile.saved") });
    } catch (err) {
      setProfileFlash({
        type: "err",
        text: err instanceof Error ? err.message : t("profile.saveError")
      });
    } finally {
      setProfileBusy(false);
    }
  }

  async function onChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordBusy(true);
    setPasswordFlash(null);
    try {
      await changeAdminPassword({ currentPassword, password, confirmPassword });
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
      setPasswordFlash({ type: "ok", text: t("profile.passwordSaved") });
    } catch (err) {
      setPasswordFlash({
        type: "err",
        text: err instanceof Error ? err.message : t("profile.passwordError")
      });
    } finally {
      setPasswordBusy(false);
    }
  }

  const tabs: { id: ProfileTab; label: string; icon: typeof FiUser }[] = [
    { id: "general", label: t("profile.tab.general"), icon: FiUser },
    { id: "security", label: t("profile.tab.security"), icon: FiLock }
  ];

  return (
    <div className="zt-profile-shell w-full">
      <div className="zt-profile-hero">
        <div className="zt-profile-hero-inner">
          <div className="zt-profile-avatar" aria-hidden>
            {initialsFromName(admin.fullName || admin.email)}
          </div>
          <div className="zt-profile-hero-text">
            <p className="zt-profile-hero-kicker">{t("profile.memberSince")}</p>
            <h2 className="zt-profile-hero-name">{admin.fullName || admin.email}</h2>
            <p className="zt-profile-hero-email">{admin.email}</p>
            <div className="zt-profile-hero-badges">
              <span className="zt-profile-badge zt-profile-badge--role">
                <FiShield className="h-3.5 w-3.5" aria-hidden />
                {roleLabel}
              </span>
              <span
                className={[
                  "zt-profile-badge",
                  isActive ? "zt-profile-badge--ok" : "zt-profile-badge--danger"
                ].join(" ")}
              >
                {statusLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="zt-profile-panel">
        <div className="zt-profile-tabs" role="tablist" aria-label={t("page.profile.title")}>
          {tabs.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={`profile-tab-${id}`}
                id={`profile-tab-btn-${id}`}
                className={["zt-profile-tab", active ? "zt-profile-tab--active" : ""].join(" ")}
                onClick={() => setTab(id)}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                {label}
              </button>
            );
          })}
        </div>

        <div className="zt-profile-tab-body">
          {tab === "general" ? (
            <section
              id="profile-tab-general"
              role="tabpanel"
              aria-labelledby="profile-tab-btn-general"
              className="zt-profile-tab-panel"
            >
              <header className="zt-profile-section-head">
                <h3 className="zt-profile-section-title">{t("profile.accountSection")}</h3>
                <p className="zt-profile-section-desc">{t("profile.accountHint")}</p>
              </header>

              <div className="zt-profile-info-grid">
                <InfoTile icon={FiMail} label={t("login.email")} value={admin.email} wide />
                <InfoTile icon={FiShield} label={t("page.dashboard.role")} value={roleLabel} />
                <InfoTile icon={FiUser} label={t("page.dashboard.status")} value={statusLabel} />
              </div>

              <form onSubmit={(e) => void onSaveProfile(e)} className="zt-profile-form">
                <FlashBanner flash={profileFlash} />

                <div className="zt-profile-form-grid">
                  <label className="zt-profile-field zt-profile-field--full">
                    <span className="zt-profile-field-label">{t("page.profile.fullName")}</span>
                    <input
                      type="text"
                      className="zt-profile-input"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      minLength={2}
                      maxLength={80}
                      disabled={profileBusy}
                      autoComplete="name"
                    />
                  </label>
                </div>

                <footer className="zt-profile-form-footer">
                  <button
                    type="submit"
                    disabled={profileBusy || !nameDirty}
                    className="zt-profile-btn zt-profile-btn--primary"
                  >
                    {profileBusy ? t("login.wait") : t("profile.saveProfile")}
                  </button>
                </footer>
              </form>
            </section>
          ) : null}

          {tab === "security" ? (
            <section
              id="profile-tab-security"
              role="tabpanel"
              aria-labelledby="profile-tab-btn-security"
              className="zt-profile-tab-panel"
            >
              <header className="zt-profile-section-head">
                <h3 className="zt-profile-section-title">{t("profile.passwordSection")}</h3>
                <p className="zt-profile-section-desc">{t("profile.passwordHint")}</p>
              </header>

              <form onSubmit={(e) => void onChangePassword(e)} className="zt-profile-form">
                <FlashBanner flash={passwordFlash} />

                <div className="zt-profile-form-grid">
                  <PasswordField
                    id="profile-current-password"
                    className="zt-profile-field--full"
                    label={t("profile.currentPassword")}
                    value={currentPassword}
                    onChange={setCurrentPassword}
                    autoComplete="current-password"
                    disabled={passwordBusy}
                    required
                  />
                  <PasswordField
                    id="profile-new-password"
                    label={t("profile.newPassword")}
                    value={password}
                    onChange={setPassword}
                    autoComplete="new-password"
                    disabled={passwordBusy}
                    required
                    minLength={8}
                  />
                  <PasswordField
                    id="profile-confirm-password"
                    label={t("profile.confirmPassword")}
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    autoComplete="new-password"
                    disabled={passwordBusy}
                    required
                    minLength={8}
                  />
                </div>

                <footer className="zt-profile-form-footer">
                  <button
                    type="submit"
                    disabled={passwordBusy}
                    className="zt-profile-btn zt-profile-btn--primary"
                  >
                    {passwordBusy ? t("login.wait") : t("profile.changePassword")}
                  </button>
                </footer>
              </form>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
