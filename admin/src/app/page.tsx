"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminLoadingScreen } from "@/components/loading/AdminLoadingScreen";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useMinLoaderDelay } from "@/hooks/useMinLoaderDelay";

export default function HomePage() {
  const { status } = useAdminAuth();
  const router = useRouter();
  const minLoaderDone = useMinLoaderDelay();

  useEffect(() => {
    if (!minLoaderDone || status === "loading") return;
    router.replace(status === "authenticated" ? "/dashboard" : "/login");
  }, [status, router, minLoaderDone]);

  if (!minLoaderDone || status === "loading") {
    return <AdminLoadingScreen />;
  }

  return null;
}
