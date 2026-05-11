"use client";

import { useCallback, useEffect, useState } from "react";
import { FiChevronUp } from "react-icons/fi";

const BTN_PX = 52;
const STROKE = 3;
const PAD = 2;
const R = (BTN_PX - STROKE) / 2 - PAD;
const CIRC = 2 * Math.PI * R;
const CX = BTN_PX / 2;
const SHOW_AFTER_PX = 320;

export function ScrollToTopButton() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const update = useCallback(() => {
    const el = document.documentElement;
    const scrollTop = el.scrollTop;
    const scrollable = el.scrollHeight - el.clientHeight;
    const p = scrollable > 0 ? scrollTop / scrollable : 0;
    setProgress(Math.min(1, Math.max(0, p)));
    setVisible(scrollTop > SHOW_AFTER_PX);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const goTop = useCallback(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, []);

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={goTop}
      className={[
        "fixed bottom-6 right-6 z-[100] flex h-[52px] w-[52px] items-center justify-center rounded-full",
        "bg-white text-red-600 shadow-lg shadow-zinc-900/10 ring-1 ring-zinc-200/90 transition-all duration-300",
        "hover:bg-zinc-50 hover:shadow-xl hover:ring-zinc-300/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600",
        "dark:bg-zinc-900 dark:text-red-400 dark:shadow-black/40 dark:ring-white/10 dark:hover:bg-zinc-800 dark:hover:ring-white/20",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      ].join(" ")}
    >
      <svg
        className="absolute inset-0 -rotate-90 text-red-600 dark:text-red-400"
        width={BTN_PX}
        height={BTN_PX}
        viewBox={`0 0 ${BTN_PX} ${BTN_PX}`}
        aria-hidden
      >
        <circle
          className="fill-none stroke-zinc-200 dark:stroke-zinc-600"
          cx={CX}
          cy={CX}
          r={R}
          strokeWidth={STROKE}
        />
        <circle
          className="fill-none stroke-current"
          cx={CX}
          cy={CX}
          r={R}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${progress * CIRC} ${CIRC}`}
        />
      </svg>
      <FiChevronUp className="relative z-10 h-6 w-6" strokeWidth={2.5} aria-hidden />
    </button>
  );
}
