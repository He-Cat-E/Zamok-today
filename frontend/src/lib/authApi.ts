import { env } from "@/lib/env";
import { AuthApiError } from "@/lib/authErrors";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  authMethod?: "email" | "phone";
  avatarUrl: string;
  nationalId?: string;
  dateOfBirth?: string;
  emailVerified: boolean;
  phoneVerified?: boolean;
};

type AuthResponse = { user: AuthUser };

async function parseJson<T>(res: Response): Promise<T> {
  const data = (await res.json().catch(() => ({}))) as T & { error?: string; code?: string };
  if (!res.ok) {
    const message = typeof data.error === "string" ? data.error : "Request failed";
    throw new AuthApiError(message, typeof data.code === "string" ? data.code : undefined);
  }
  return data;
}

export async function authRegister(body: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  return parseJson<
    AuthResponse & { message?: string; verifyUrl?: string; devNote?: string; mailError?: string }
  >(
    await fetch(`${env.apiBaseUrl}/api/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
  );
}

export type PhoneAuthBody = {
  country: string;
  phone: string;
};

export async function authPhoneSendCode(body: PhoneAuthBody & { purpose: "login" | "register" }) {
  return parseJson<{
    message: string;
    expiresInSeconds?: number;
    devOtp?: string;
    devNote?: string;
    existingAccount?: boolean;
  }>(
    await fetch(`${env.apiBaseUrl}/api/auth/phone/send-code`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
  );
}

export async function authPhoneLogin(body: PhoneAuthBody & { code: string }) {
  return parseJson<AuthResponse>(
    await fetch(`${env.apiBaseUrl}/api/auth/phone/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
  );
}

export async function authPhoneRegister(body: PhoneAuthBody & { fullName: string; code: string }) {
  return parseJson<AuthResponse & { message?: string; existingAccount?: boolean }>(
    await fetch(`${env.apiBaseUrl}/api/auth/phone/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
  );
}

export async function authLogin(body: { identifier: string; password: string; rememberMe?: boolean }) {
  return parseJson<AuthResponse>(
    await fetch(`${env.apiBaseUrl}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
  );
}

export async function authLogout() {
  return parseJson<{ ok: boolean }>(
    await fetch(`${env.apiBaseUrl}/api/auth/logout`, {
      method: "POST",
      credentials: "include"
    })
  );
}

export async function authMe() {
  return parseJson<AuthResponse>(
    await fetch(`${env.apiBaseUrl}/api/auth/me`, {
      credentials: "include",
      cache: "no-store"
    })
  );
}

export async function authUpdateProfile(body: {
  fullName: string;
  nationalId?: string;
  dateOfBirth?: string;
}) {
  return parseJson<AuthResponse>(
    await fetch(`${env.apiBaseUrl}/api/auth/profile`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
  );
}

export async function authForgotPassword(email: string) {
  return parseJson<{ message: string; resetUrl?: string; devNote?: string }>(
    await fetch(`${env.apiBaseUrl}/api/auth/forgot-password`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    })
  );
}

export async function authVerifyEmail(token: string) {
  return parseJson<AuthResponse & { message?: string }>(
    await fetch(`${env.apiBaseUrl}/api/auth/verify-email`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    })
  );
}

export async function authResendVerification() {
  return parseJson<{ message: string; verifyUrl?: string; devNote?: string; user?: AuthUser }>(
    await fetch(`${env.apiBaseUrl}/api/auth/resend-verification`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    })
  );
}

export async function authResetPassword(body: {
  token: string;
  password: string;
  confirmPassword: string;
}) {
  return parseJson<AuthResponse & { message?: string }>(
    await fetch(`${env.apiBaseUrl}/api/auth/reset-password`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
  );
}

export function userInitials(user: Pick<AuthUser, "fullName" | "email" | "phone">) {
  const base = user.fullName?.trim() || user.email?.trim() || user.phone?.trim() || "?";
  const parts = base.replace(/[^a-zA-Z0-9]/g, " ").split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return base.slice(0, 2).toUpperCase();
}
