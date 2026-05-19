import { env } from "@/lib/env";

export type AdminUser = {
  id: string;
  email: string;
  fullName: string;
  role: string;
};

async function parseJson<T>(res: Response): Promise<T> {
  return res.json() as Promise<T>;
}

export async function adminLogin(
  email: string,
  password: string,
  rememberMe = false
): Promise<AdminUser> {
  const res = await fetch(`${env.apiBaseUrl}/api/admin/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, rememberMe })
  });
  const data = await parseJson<{ error?: string; admin?: AdminUser }>(res);
  if (!res.ok) {
    throw new Error(typeof data.error === "string" ? data.error : "Login failed");
  }
  if (!data.admin) throw new Error("No admin data returned");
  return data.admin;
}

export async function adminLogout(): Promise<void> {
  await fetch(`${env.apiBaseUrl}/api/admin/auth/logout`, {
    method: "POST",
    credentials: "include"
  });
}

export async function fetchAdminMe(): Promise<AdminUser | null> {
  const res = await fetch(`${env.apiBaseUrl}/api/admin/auth/me`, {
    credentials: "include"
  });
  if (res.status === 401) return null;
  const data = await parseJson<{ admin?: AdminUser; error?: string }>(res);
  if (!res.ok) return null;
  return data.admin ?? null;
}

export type AccountStatus = "active" | "suspended";

export type AdminUserWalletTransaction = {
  id: string;
  type: string;
  label: string;
  amount: number;
  currency: string;
  status: string;
  cardLast4: string;
  createdAt: string;
};

export type AdminUserWalletResponse = {
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    accountStatus: AccountStatus;
  };
  wallet: {
    balance: number;
    currency: string;
    updatedAt?: string;
  };
  transactions: AdminUserWalletTransaction[];
};

export async function fetchAdminUserWallet(userId: string): Promise<AdminUserWalletResponse> {
  const res = await fetch(`${env.apiBaseUrl}/api/admin/users/${encodeURIComponent(userId)}/wallet`, {
    credentials: "include"
  });
  const data = await parseJson<AdminUserWalletResponse & { error?: string }>(res);
  if (!res.ok) {
    throw new Error(typeof data.error === "string" ? data.error : "Could not load wallet");
  }
  return data;
}

export async function setAdminUserAccountStatus(
  userId: string,
  status: AccountStatus
): Promise<{ user: { id: string; fullName: string; accountStatus: AccountStatus } }> {
  const res = await fetch(
    `${env.apiBaseUrl}/api/admin/users/${encodeURIComponent(userId)}/account-status`,
    {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    }
  );
  const data = await parseJson<{
    user?: { id: string; fullName: string; accountStatus: AccountStatus };
    error?: string;
  }>(res);
  if (!res.ok || !data.user) {
    throw new Error(typeof data.error === "string" ? data.error : "Could not update account");
  }
  return { user: data.user };
}
