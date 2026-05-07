"use client";

import { useEffect, useState } from "react";
import { FlightSearch } from "@/components/FlightSearch";
import { Topbar } from "@/components/Topbar";
import { HeroTitle } from "@/components/hero/HeroTitle";

export function Header() {
  const [expandedSpacer, setExpandedSpacer] = useState(false);

  useEffect(() => {
    function onScroll() {
      setExpandedSpacer(window.scrollY > 200);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Topbar />

      <section className="bg-red-600 dark:bg-black">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-1 md:py-20">
          <div className="mt-3 mb-4 text-center text-white md:mt-12 md:mb-8">
            <HeroTitle />
          </div>
          <FlightSearch usePersistedSearchForm={false} />
        </div>
      </section>
      <section
        className={[
          "bg-red-600 dark:bg-black transition-[height] duration-300",
          expandedSpacer ? "h-[200px] md:h-[80px]" : "h-3 md:h-[80px]"
        ].join(" ")}
      >
      </section>
    </>
  );
}

