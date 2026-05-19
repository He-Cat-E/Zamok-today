"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminLoadingScreen } from "@/components/loading/AdminLoadingScreen";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useMinLoaderDelay } from "@/hooks/useMinLoaderDelay";

export function RequireAdminAuth({ children }: { children: React.ReactNode }) {
  const { status } = useAdminAuth();
  const router = useRouter();
  const minLoaderDone = useMinLoaderDelay();

  useEffect(() => {
    if (status === "unauthenticated" && minLoaderDone) {
      router.replace("/login");
    }
  }, [status, router, minLoaderDone]);

  if (!minLoaderDone || status === "loading") {
    return <AdminLoadingScreen />;
  }

  if (status !== "authenticated") {
    return null;
  }

  return <>{children}</>;
}
