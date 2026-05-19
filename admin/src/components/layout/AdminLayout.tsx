"use client";

import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminTopbar } from "@/components/layout/AdminTopbar";
import { useAdminLayout } from "@/context/AdminLayoutContext";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useAdminLayout();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AdminSidebar />
      <div
        className={[
          "flex min-h-screen flex-col transition-[padding] duration-300 ease-in-out",
          sidebarCollapsed ? "pl-[4.25rem]" : "pl-[17rem]"
        ].join(" ")}
      >
        <AdminTopbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
