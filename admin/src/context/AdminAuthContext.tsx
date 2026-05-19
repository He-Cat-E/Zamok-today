"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import {
  adminLogin as apiLogin,
  adminLogout as apiLogout,
  fetchAdminMe,
  type AdminUser
} from "@/lib/adminApi";

type AdminAuthContextValue = {
  admin: AdminUser | null;
  status: "loading" | "authenticated" | "unauthenticated";
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  const refresh = useCallback(async () => {
    const me = await fetchAdminMe();
    setAdmin(me);
    setStatus(me ? "authenticated" : "unauthenticated");
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string, rememberMe = false) => {
    const user = await apiLogin(email, password, rememberMe);
    setAdmin(user);
    setStatus("authenticated");
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setAdmin(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo(
    () => ({ admin, status, login, logout, refresh }),
    [admin, status, login, logout, refresh]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
