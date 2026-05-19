import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin.js";
import { adminLoginSchema, formatZodError } from "../validators/admin.validator.js";
import {
  signAdminToken,
  adminCookieOptions,
  getAdminCookieName
} from "../utils/adminTokens.js";

const BCRYPT_ROUNDS = 12;

function setAdminCookie(res, adminId, rememberMe = false) {
  const token = signAdminToken(adminId, rememberMe);
  res.cookie(getAdminCookieName(), token, adminCookieOptions(rememberMe));
}

function clearAdminCookie(res) {
  res.clearCookie(getAdminCookieName(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });
}

export async function login(req, res) {
  const parsed = adminLoginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: formatZodError(parsed.error) });
  }

  const emailNorm = parsed.data.email.trim().toLowerCase();
  const admin = await Admin.findOne({ email: emailNorm }).select("+passwordHash");
  if (!admin) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const ok = await bcrypt.compare(parsed.data.password, admin.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  setAdminCookie(res, admin._id, Boolean(parsed.data.rememberMe));
  return res.json({ admin: admin.toPublicJSON() });
}

export async function logout(_req, res) {
  clearAdminCookie(res);
  return res.json({ ok: true });
}

export async function me(req, res) {
  if (!req.admin) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return res.json({ admin: req.admin.toPublicJSON() });
}
