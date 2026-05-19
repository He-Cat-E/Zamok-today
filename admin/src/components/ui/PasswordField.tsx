"use client";

import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useT } from "@/i18n/I18nProvider";

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  disabled?: boolean;
  minLength?: number;
  required?: boolean;
  hint?: string;
  className?: string;
  inputClassName?: string;
};

export function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
  disabled = false,
  minLength,
  required = false,
  hint,
  className = "",
  inputClassName = "zt-profile-input"
}: PasswordFieldProps) {
  const t = useT();
  const [visible, setVisible] = useState(false);
  const toggleLabel = visible ? t("auth.hidePassword") : t("auth.showPassword");

  return (
    <label
      className={["zt-password-field zt-profile-field block", className].filter(Boolean).join(" ")}
    >
      <span className="zt-profile-field-label mb-1 block">{label}</span>
      <div className="zt-password-input-wrap">
        <input
          id={id}
          type={visible ? "text" : "password"}
          className={[inputClassName, "zt-password-input"].filter(Boolean).join(" ")}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          disabled={disabled}
          minLength={minLength}
          required={required}
        />
        <button
          type="button"
          className="zt-password-toggle"
          onClick={() => setVisible((v) => !v)}
          disabled={disabled}
          aria-label={toggleLabel}
          aria-pressed={visible}
        >
          {visible ? <FiEyeOff className="h-4 w-4" aria-hidden /> : <FiEye className="h-4 w-4" aria-hidden />}
        </button>
      </div>
      {hint ? <span className="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">{hint}</span> : null}
    </label>
  );
}
