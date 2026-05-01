import Link from "next/link";

export default function DestinationNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 dark:bg-black">
      <p className="text-lg font-semibold text-slate-900 dark:text-white">Destination not found</p>
      <Link href="/" className="rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700">
        Back to home
      </Link>
    </main>
  );
}
