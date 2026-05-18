import Link from "next/link";

/** Shared pill control for Support, locale, and auth actions in the top bar. */
export const topbarPillClassName =
  "inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 ring-1 ring-slate-200 transition-colors hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:ring-white/15 dark:hover:bg-white/15";

export function TopbarPill({
  className = "",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={[topbarPillClassName, className].filter(Boolean).join(" ")} {...props}>
      {children}
    </button>
  );
}

export function TopbarPillLink({
  className = "",
  children,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <Link className={[topbarPillClassName, className].filter(Boolean).join(" ")} {...props}>
      {children}
    </Link>
  );
}
