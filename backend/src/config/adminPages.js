/** Admin panel sections — keys match frontend routes (without leading slash). */
export const ADMIN_PAGE_KEYS = ["dashboard", "users", "admins", "transactions"];

export const ADMIN_PAGE_PATHS = {
  dashboard: "/dashboard",
  users: "/users",
  admins: "/admins",
  transactions: "/transactions"
};

export function isValidAdminPageKey(key) {
  return ADMIN_PAGE_KEYS.includes(String(key || "").trim());
}

export function sanitizeAdminPermissions(input) {
  if (!Array.isArray(input)) return [];
  const seen = new Set();
  const out = [];
  for (const raw of input) {
    const key = String(raw || "").trim();
    if (!isValidAdminPageKey(key) || seen.has(key)) continue;
    seen.add(key);
    out.push(key);
  }
  return out;
}

export function isSuperAdmin(admin) {
  return admin?.role === "super_admin";
}

export function getEffectivePageKeys(admin) {
  if (!admin) return [];
  if (isSuperAdmin(admin)) return [...ADMIN_PAGE_KEYS];
  return sanitizeAdminPermissions(admin.permissions);
}

export function adminHasPageKey(admin, pageKey) {
  if (!admin) return false;
  if (isSuperAdmin(admin)) return true;
  return getEffectivePageKeys(admin).includes(pageKey);
}

export function adminCanManageAdmins(admin) {
  return adminHasPageKey(admin, "admins");
}

export function permissionsToPaths(keys) {
  return keys.map((k) => ADMIN_PAGE_PATHS[k]).filter(Boolean);
}
