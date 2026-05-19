"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiCheck, FiImage, FiUpload, FiX } from "react-icons/fi";
import { IdCardScanOverlay } from "@/components/profile/IdCardScanOverlay";
import type { DetectedPersonalData } from "@/lib/profileApi";
import { scanProfileIdDocument } from "@/lib/profileApi";
import { useT } from "@/i18n/I18nProvider";
import { toast } from "@/lib/toast";

export function ProfileIdScanModal({
  open,
  onClose,
  onSave,
  saving = false
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: DetectedPersonalData) => Promise<void>;
  saving?: boolean;
}) {
  const t = useT();
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<DetectedPersonalData | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, saving]);

  useEffect(() => {
    if (!open) {
      setPreview(null);
      setResult(null);
      setScanning(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }, [open]);

  function clearImage() {
    setPreview(null);
    setResult(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleFile(file: File | null) {
    if (!file) return;
    clearImage();
    setPreview(URL.createObjectURL(file));
    setScanning(true);

    try {
      const data = await scanProfileIdDocument(file);
      setResult(data);
      toast.success(t("profile.scanSuccess"));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("auth.error.generic"));
    } finally {
      setScanning(false);
    }
  }

  async function handleSave() {
    if (!result?.nationalId && !result?.dateOfBirth) {
      toast.error(t("profile.scanNoData"));
      return;
    }
    await onSave(result);
  }

  const canSave = Boolean(result?.nationalId || result?.dateOfBirth);

  const confidenceLabel =
    result?.confidence === "high"
      ? t("profile.scanConfidenceHigh")
      : result?.confidence === "medium"
        ? t("profile.scanConfidenceMedium")
        : t("profile.scanConfidenceLow");

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-id-scan-title"
      onClick={() => !saving && onClose()}
    >
      <div
        className="flex max-h-[min(92dvh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-zinc-200 dark:bg-zinc-950 dark:ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 shrink-0 bg-brand-600" aria-hidden />
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-zinc-100 px-5 py-4 dark:border-white/10">
          <div>
            <h2 id="profile-id-scan-title" className="text-base font-semibold text-zinc-900 dark:text-white">
              {t("profile.scanTitle")}
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{t("profile.scanHint")}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:opacity-50 dark:border-white/15 dark:text-white dark:hover:bg-white/5"
            aria-label={t("profile.scanClose")}
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => void handleFile(e.target.files?.[0] ?? null)}
          />

          {!preview ? (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={scanning || saving}
              className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-brand-200 bg-brand-50/50 px-6 py-10 text-center transition hover:border-brand-400 hover:bg-brand-50 dark:border-brand-500/30 dark:bg-brand-950/20 dark:hover:border-brand-500/50"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-brand-600 shadow-sm dark:bg-zinc-900 dark:text-brand-300">
                <FiUpload className="h-6 w-6" />
              </span>
              <span className="text-sm font-semibold text-zinc-900 dark:text-white">{t("profile.scanUpload")}</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{t("profile.scanFormats")}</span>
            </button>
          ) : (
            <div className="grid gap-5 sm:grid-cols-[140px_1fr]">
              <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-white/10 dark:bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="" className="aspect-[3/4] w-full object-cover" />
                {scanning ? <IdCardScanOverlay label={t("profile.scanning")} /> : null}
                <button
                  type="button"
                  onClick={clearImage}
                  disabled={saving}
                  className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80 disabled:opacity-50"
                  aria-label={t("profile.scanRemove")}
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>

              {result ? (
                <div className="space-y-4">
                  <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800 dark:border-brand-500/30 dark:bg-brand-950/40 dark:text-brand-200">
                    <FiImage className="h-3.5 w-3.5" />
                    {confidenceLabel}
                  </p>
                  <dl className="space-y-3 rounded-xl border border-zinc-100 bg-zinc-50/80 p-4 text-sm dark:border-white/10 dark:bg-zinc-900/50">
                    {result.nationalId ? (
                      <div className="flex justify-between gap-4">
                        <dt className="text-zinc-500 dark:text-zinc-400">{t("profile.nationalId")}</dt>
                        <dd className="font-mono font-semibold text-zinc-900 dark:text-white">
                          {result.nationalId}
                          {result.nationalIdValid ? (
                            <FiCheck className="ml-1 inline h-4 w-4 text-emerald-600" aria-hidden />
                          ) : null}
                        </dd>
                      </div>
                    ) : null}
                    {result.dateOfBirth ? (
                      <div className="flex justify-between gap-4">
                        <dt className="text-zinc-500 dark:text-zinc-400">{t("profile.dateOfBirth")}</dt>
                        <dd className="font-semibold text-zinc-900 dark:text-white">{result.dateOfBirth}</dd>
                      </div>
                    ) : null}
                  </dl>
                </div>
              ) : !scanning ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("profile.scanNoData")}</p>
              ) : null}
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap justify-end gap-3 border-t border-zinc-100 px-5 py-4 dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 disabled:opacity-50 dark:border-white/15 dark:text-white dark:hover:bg-white/5"
          >
            {t("profile.scanClose")}
          </button>
          {preview ? (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={scanning || saving}
              className="rounded-xl border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 disabled:opacity-50 dark:border-white/15 dark:text-white dark:hover:bg-white/5"
            >
              {t("profile.scanAnother")}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={!canSave || scanning || saving}
            className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            {saving ? t("auth.pleaseWait") : t("profile.scanSave")}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
