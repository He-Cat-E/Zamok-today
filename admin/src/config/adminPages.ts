export type AdminPageKey = "dashboard" | "users" | "admins" | "transactions";

export const ADMIN_PAGES: {
  key: AdminPageKey;
  path: string;
  labelKey: string;
}[] = [
  { key: "dashboard", path: "/dashboard", labelKey: "nav.dashboard" },
  { key: "users", path: "/users", labelKey: "nav.users" },
  { key: "admins", path: "/admins", labelKey: "nav.admins" },
  { key: "transactions", path: "/transactions", labelKey: "nav.transactions" }
];

export function pageKeyFromPath(pathname: string): AdminPageKey | null {
  const hit = ADMIN_PAGES.find(
    (p) => pathname === p.path || (p.path !== "/dashboard" && pathname.startsWith(`${p.path}/`))
  );
  return hit?.key ?? null;
}

export function canAccessPath(
  admin: { role?: string; permissions?: string[] } | null,
  pathname: string
): boolean {
  if (!admin) return false;
  if (admin.role === "super_admin") return true;
  const key = pageKeyFromPath(pathname);
  if (!key) return true;
  return (admin.permissions ?? []).includes(key);
}

export function firstAllowedPath(admin: { role?: string; permissions?: string[] } | null): string {
  if (!admin) return "/login";
  if (admin.role === "super_admin") return "/dashboard";
  const keys = admin.permissions ?? [];
  const page = ADMIN_PAGES.find((p) => keys.includes(p.key));
  return page?.path ?? "/dashboard";
}

export function filterNavForAdmin<T extends { href: string }>(
  items: T[],
  admin: { role?: string; permissions?: string[] } | null
): T[] {
  if (!admin) return [];
  if (admin.role === "super_admin") return items;
  const allowed = new Set(admin.permissions ?? []);
  return items.filter((item) => {
    const key = pageKeyFromPath(item.href);
    return key ? allowed.has(key) : true;
  });
}
