import type { IconType } from "react-icons";
import { FiCreditCard, FiHome, FiShield, FiUsers } from "react-icons/fi";

export type AdminNavItem = {
  href: string;
  labelKey: string;
  icon: IconType;
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: "/dashboard", labelKey: "nav.dashboard", icon: FiHome },
  { href: "/users", labelKey: "nav.users", icon: FiUsers },
  { href: "/admins", labelKey: "nav.admins", icon: FiShield },
  { href: "/transactions", labelKey: "nav.transactions", icon: FiCreditCard }
];
