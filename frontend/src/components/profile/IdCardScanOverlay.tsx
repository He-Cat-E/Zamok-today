"use client";

/** QR-style laser scan overlay while ID OCR runs (brand red). */
export function IdCardScanOverlay({ label }: { label: string }) {
  return (
    <div
      className="absolute inset-0 z-10 overflow-hidden rounded-xl"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="absolute inset-0 bg-brand-950/88" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgb(53_12_12/0.55)_100%)]" />

      <div className="pointer-events-none absolute inset-3">
        <span className="absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-brand-500 shadow-[0_0_8px_rgb(195_44_43/0.6)]" />
        <span className="absolute right-0 top-0 h-6 w-6 border-r-2 border-t-2 border-brand-500 shadow-[0_0_8px_rgb(195_44_43/0.6)]" />
        <span className="absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 border-brand-500 shadow-[0_0_8px_rgb(195_44_43/0.6)]" />
        <span className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-brand-500 shadow-[0_0_8px_rgb(195_44_43/0.6)]" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-full">
        <div className="absolute inset-x-3 animate-id-card-scan-line motion-reduce:top-1/2 motion-reduce:-translate-y-1/2 motion-reduce:animate-none">
          <div className="relative h-px w-full">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-brand-400 shadow-[0_0_14px_3px_rgb(195_44_43/0.95),0_0_32px_8px_rgb(195_44_43/0.45)]" />
            <div className="absolute inset-x-0 -top-8 h-16 bg-gradient-to-b from-transparent via-brand-500/35 to-transparent blur-sm" />
            <div className="absolute inset-x-0 top-[2px] h-20 bg-gradient-to-b from-brand-500/55 via-brand-600/20 to-transparent blur-md" />
          </div>
        </div>
      </div>

      <p className="absolute bottom-2.5 left-0 right-0 px-2 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-brand-200">
        {label}
      </p>
    </div>
  );
}
