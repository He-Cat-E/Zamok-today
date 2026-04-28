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
        <div className="mx-auto w-full max-w-[1440px] px-4 py-20">
          <div className="text-center text-white mt-12 mb-8">
            <HeroTitle />
          </div>
          <FlightSearch />
        </div>
      </section>
      <section
        className={[
          "bg-red-600 dark:bg-black transition-[height] duration-300",
          "h-[80px]"
        ].join(" ")}
      >
      </section>
    </>
  );
}

