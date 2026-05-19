"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { RequireAdminAuth } from "@/components/auth/RequireAdminAuth";
import { AdminLayoutProvider } from "@/context/AdminLayoutContext";

export function PanelChrome({ children }: { children: React.ReactNode }) {
  return (
    <RequireAdminAuth>
      <AdminLayoutProvider>
        <AdminLayout>{children}</AdminLayout>
      </AdminLayoutProvider>
    </RequireAdminAuth>
  );
}
