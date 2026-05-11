"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";

/**
 * Wraps insurance landing `<main>`: smooth in-page anchor scrolling (global `html`)
 * and a one-time fade/slide-in for each direct child `<section>` after the hero.
 */
export function InsuranceScrollMain({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    const sections = Array.from(root.querySelectorAll<HTMLElement>(":scope > section")).slice(1);
    if (sections.length === 0) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) {
      sections.forEach((el) => {
        el.classList.add("insurance-section-preveal");
        el.classList.add("insurance-section-visible");
      });
      return;
    }

    sections.forEach((el) => el.classList.add("insurance-section-preveal"));
  }, []);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const sections = Array.from(root.querySelectorAll<HTMLElement>(":scope > section")).slice(1);
    if (sections.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("insurance-section-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
    );

    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main ref={ref} className="flex-1 insurance-landing-scroll">
      {children}
    </main>
  );
}
