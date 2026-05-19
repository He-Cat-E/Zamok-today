type AdminPageHeaderProps = {
  title: string;
  subtitle?: string;
};

export function AdminPageHeader({ title, subtitle }: AdminPageHeaderProps) {
  return (
    <header className="mb-6 sm:mb-8">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-1.5 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</p>
      ) : null}
    </header>
  );
}
