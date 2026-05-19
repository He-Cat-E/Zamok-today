import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin.js";

const BCRYPT_ROUNDS = 12;

/**
 * Ensures a super admin exists (credentials from env on first run only).
 */
export async function seedSuperAdmin() {
  const email = String(process.env.ADMIN_EMAIL || "admin@zamok.local")
    .trim()
    .toLowerCase();
  const password = String(process.env.ADMIN_PASSWORD || "Admin123!ChangeMe");

  if (!email || !password) {
    // eslint-disable-next-line no-console
    console.warn("[admin] ADMIN_EMAIL and ADMIN_PASSWORD required to seed super admin");
    return;
  }

  const existing = await Admin.findOne({ email });
  if (existing) {
    return;
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  await Admin.create({
    email,
    passwordHash,
    fullName: "Super Admin",
    role: "super_admin",
    accountStatus: "active",
    permissions: ["dashboard", "users", "admins", "transactions"]
  });

  // eslint-disable-next-line no-console
  console.log(`[admin] Super admin account created (${email}). Change ADMIN_PASSWORD in production.`);
}
