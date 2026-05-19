"use client";

import { useEffect } from "react";
import { FiX } from "react-icons/fi";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  closeLabel: string;
  variant?: "danger" | "default";
  loading?: boolean;
  loadingLabel?: string;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  closeLabel,
  variant = "default",
  loading = false,
  loadingLabel = "…",
  error = null,
  onConfirm,
  onCancel
}: ConfirmModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !loading) onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div
      className="zt-modal-backdrop"
      role="presentation"
      onClick={(e) => {
        if (!loading && e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        className="zt-modal zt-confirm-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-message"
      >
        <div className="zt-modal-header">
          <h2 id="confirm-modal-title" className="zt-modal-title">
            {title}
          </h2>
          <button
            type="button"
            className="zt-modal-close"
            onClick={onCancel}
            disabled={loading}
            aria-label={closeLabel}
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="zt-modal-body">
          <p id="confirm-modal-message" className="zt-confirm-message">
            {message}
          </p>
          {error ? <p className="zt-confirm-error">{error}</p> : null}
        </div>

        <div className="zt-confirm-footer">
          <button type="button" className="zt-confirm-btn zt-confirm-btn--ghost" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`zt-confirm-btn ${variant === "danger" ? "zt-confirm-btn--danger" : "zt-confirm-btn--primary"}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? loadingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
