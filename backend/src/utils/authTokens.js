import crypto from "node:crypto";
import jwt from "jsonwebtoken";

const JWT_SECRET = () => String(process.env.JWT_SECRET || "zamok-dev-change-me");
const JWT_EXPIRES_IN = () => String(process.env.JWT_EXPIRES_IN || "7d");
const COOKIE_NAME = "auth_token";

export function signAuthToken(userId) {
  return jwt.sign({ sub: String(userId) }, JWT_SECRET(), { expiresIn: JWT_EXPIRES_IN() });
}

export function verifyAuthToken(token) {
  return jwt.verify(token, JWT_SECRET());
}

export function authCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
}

export function getAuthCookieName() {
  return COOKIE_NAME;
}

export function hashResetToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function createResetToken() {
  return crypto.randomBytes(32).toString("hex");
}
