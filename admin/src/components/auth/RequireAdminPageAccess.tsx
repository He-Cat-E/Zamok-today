"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { firstAllowedPath, canAccessPath } from "@/config/adminPages";
import { useAdminAuth } from "@/context/AdminAuthContext";

export function RequireAdminPageAccess({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, status } = useAdminAuth();

  useEffect(() => {
    if (status !== "authenticated" || !admin) return;
    if (!canAccessPath(admin, pathname)) {
      router.replace(firstAllowedPath(admin));
    }
  }, [admin, pathname, router, status]);

  if (status !== "authenticated" || !admin) return null;
  if (!canAccessPath(admin, pathname)) return null;

  return <>{children}</>;
}
