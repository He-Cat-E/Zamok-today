"use client";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-black dark:text-white">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-16">
        <div className="text-2xl font-bold">Page not found</div>
        <div className="mt-2 text-sm text-slate-600 dark:text-white/70">
          The page you’re looking for doesn’t exist.
        </div>
      </div>
    </main>
  );
}

