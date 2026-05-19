import type { AdminUser } from "@/lib/adminApi";

export function adminInitials(admin: AdminUser): string {
  const name = admin.fullName?.trim();
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  const email = admin.email?.trim() || "?";
  return email.slice(0, 2).toUpperCase();
}
