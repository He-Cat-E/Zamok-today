"use client";

import { FlightSearch } from "@/components/FlightSearch";
import { Topbar } from "@/components/Topbar";
import { HeroTitle } from "@/components/hero/HeroTitle";

export function Header() {
  return (
    <>
      <Topbar />

      <section className="bg-red-600 dark:bg-black">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-20 pb-32">
          <div className="text-center text-white mt-12">
            <HeroTitle />
          </div>

          <div className="mt-8">
            <FlightSearch />
          </div>
        </div>
      </section>
    </>
  );
}

