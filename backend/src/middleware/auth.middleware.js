import { verifyAuthToken, getAuthCookieName } from "../utils/authTokens.js";
import { User } from "../models/User.js";

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[getAuthCookieName()];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const payload = verifyAuthToken(token);
    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = user;
    req.userId = String(user._id);
    return next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

export async function optionalAuth(req, _res, next) {
  try {
    const token = req.cookies?.[getAuthCookieName()];
    if (!token) return next();
    const payload = verifyAuthToken(token);
    const user = await User.findById(payload.sub);
    if (user) {
      req.user = user;
      req.userId = String(user._id);
    }
  } catch {
    // ignore invalid token
  }
  return next();
}
