"use client";

import type { IconType } from "react-icons";
import { FiEye, FiEyeOff } from "react-icons/fi";
import styles from "./AuthShell.module.css";

export function AuthField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  autoComplete,
  showToggle,
  visible,
  onToggleVisible
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon?: IconType;
  autoComplete?: string;
  showToggle?: boolean;
  visible?: boolean;
  onToggleVisible?: () => void;
}) {
  const inputType = showToggle ? (visible ? "text" : "password") : type;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles.inputWrap}>
        {Icon ? <Icon className={styles.inputIcon} aria-hidden /> : null}
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={[styles.input, !Icon ? styles.inputNoIcon : ""].filter(Boolean).join(" ")}
        />
        {showToggle ? (
          <button
            type="button"
            className={styles.togglePw}
            onClick={onToggleVisible}
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
          </button>
        ) : null}
      </div>
    </div>
  );
}
