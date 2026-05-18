"use client";

import { SiteFooter } from "@/components/SiteFooter";
import { Topbar } from "@/components/Topbar";

export function AccountPageShell({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-black">
      <Topbar />
      <div className="mx-auto w-full max-w-[1440px] px-4 py-8 md:py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white md:text-3xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400 md:text-base">{subtitle}</p>
          ) : null}
        </header>
        {children}
      </div>
      <SiteFooter />
    </main>
  );
}
