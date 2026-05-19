import { verifyAdminToken, getAdminCookieName } from "../utils/adminTokens.js";
import { Admin } from "../models/Admin.js";

export async function requireAdminAuth(req, res, next) {
  try {
    const token = req.cookies?.[getAdminCookieName()];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const payload = verifyAdminToken(token);
    const admin = await Admin.findById(payload.sub);
    if (!admin) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.admin = admin;
    req.adminId = String(admin._id);
    return next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
