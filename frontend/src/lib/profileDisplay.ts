import type { AuthUser } from "@/lib/authApi";
import { formatPhoneDisplay } from "@/lib/phone";

export function hasPhone(user: Pick<AuthUser, "phone">) {
  return Boolean(String(user.phone || "").trim());
}

export function hasEmail(user: Pick<AuthUser, "email">) {
  return Boolean(String(user.email || "").trim());
}

/** Primary sign-in is SMS / phone OTP. */
export function isPhoneAuthUser(user: Pick<AuthUser, "authMethod" | "phone" | "email">) {
  if (user.authMethod === "phone") return true;
  return hasPhone(user) && !hasEmail(user);
}

export function formatUserPhone(phone: string) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";
  return formatPhoneDisplay(digits);
}

/** Main contact line for header (phone or email). */
export function profilePrimaryContact(user: AuthUser): string {
  if (isPhoneAuthUser(user) && hasPhone(user)) {
    return formatUserPhone(user.phone!);
  }
  if (hasEmail(user)) return user.email.trim();
  if (hasPhone(user)) return formatUserPhone(user.phone!);
  return "";
}
