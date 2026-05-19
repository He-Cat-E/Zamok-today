import jwt from "jsonwebtoken";

const JWT_SECRET = () => String(process.env.JWT_SECRET || "zamok-dev-change-me");
const JWT_EXPIRES_IN = () => String(process.env.ADMIN_JWT_EXPIRES_IN || process.env.JWT_EXPIRES_IN || "7d");
const COOKIE_NAME = "admin_token";

export function signAdminToken(adminId, rememberMe = false) {
  const expiresIn = rememberMe ? "30d" : JWT_EXPIRES_IN();
  return jwt.sign({ sub: String(adminId), aud: "admin" }, JWT_SECRET(), {
    expiresIn
  });
}

export function verifyAdminToken(token) {
  const payload = jwt.verify(token, JWT_SECRET());
  if (payload.aud !== "admin") {
    throw new Error("Invalid admin token");
  }
  return payload;
}

export function adminCookieOptions(rememberMe = false) {
  const isProd = process.env.NODE_ENV === "production";
  const opts = {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/"
  };
  if (rememberMe) {
    opts.maxAge = 30 * 24 * 60 * 60 * 1000;
  }
  return opts;
}

export function getAdminCookieName() {
  return COOKIE_NAME;
}
