import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin.js";
import {
  adminLoginSchema,
  changeAdminPasswordSchema,
  formatZodError,
  updateAdminProfileSchema
} from "../validators/admin.validator.js";
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

  if (admin.accountStatus === "suspended") {
    return res.status(403).json({
      error: "This administrator account has been suspended",
      code: "ACCOUNT_SUSPENDED"
    });
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

export async function updateProfile(req, res) {
  if (!req.admin) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const parsed = updateAdminProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: formatZodError(parsed.error) });
  }

  req.admin.fullName = parsed.data.fullName.trim();
  await req.admin.save();

  return res.json({ admin: req.admin.toPublicJSON() });
}

export async function changePassword(req, res) {
  if (!req.adminId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const parsed = changeAdminPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: formatZodError(parsed.error) });
  }

  const admin = await Admin.findById(req.adminId).select("+passwordHash");
  if (!admin) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const currentOk = await bcrypt.compare(parsed.data.currentPassword, admin.passwordHash);
  if (!currentOk) {
    return res.status(400).json({ error: "Current password is incorrect" });
  }

  admin.passwordHash = await bcrypt.hash(parsed.data.password, BCRYPT_ROUNDS);
  await admin.save();

  return res.json({ ok: true });
}
