import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  updateProfileSchema,
  formatZodError
} from "../validators/auth.validator.js";
import {
  signAuthToken,
  authCookieOptions,
  getAuthCookieName,
  createResetToken,
  hashResetToken
} from "../utils/authTokens.js";
import { getClientOrigin, isMailConfigured } from "../config/mail.js";
import {
  sendPasswordChangedEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail
} from "../mail/send.js";
import { logResetLinkDev, shouldExposeResetLinkInResponse } from "../utils/mailDevFallback.js";
import { assignVerificationToken, hashVerificationToken } from "../utils/emailVerification.js";
import { deliverVerificationEmail } from "../utils/sendVerificationEmail.js";
import { getOrCreateWalletForUser } from "../services/wallet.service.js";

const BCRYPT_ROUNDS = 12;
const RESET_TOKEN_MS = 60 * 60 * 1000;

function setAuthCookie(res, userId) {
  const token = signAuthToken(userId);
  res.cookie(getAuthCookieName(), token, authCookieOptions());
}

function clearAuthCookie(res) {
  res.clearCookie(getAuthCookieName(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });
}

function normalizeLoginEmail(value) {
  return { email: String(value || "").trim().toLowerCase() };
}

function normalizeFullName(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ");
}

export async function register(req, res) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: formatZodError(parsed.error) });
  }

  const { fullName, email, password } = parsed.data;
  const fullNameNorm = normalizeFullName(fullName);
  const emailNorm = email.trim().toLowerCase();

  const existing = await User.findOne({ email: emailNorm }).select("+passwordHash");
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists" });
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  let user;
  try {
    user = await User.create({
      fullName: fullNameNorm,
      email: emailNorm,
      passwordHash,
      emailVerified: false
    });
  } catch (err) {
    if (err?.name === "ValidationError") {
      const msg = Object.values(err.errors || {})
        .map((e) => e?.message)
        .filter(Boolean)
        .join(" ");
      return res.status(400).json({ error: msg || "Invalid user data" });
    }
    if (err?.code === 11000) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }
    throw err;
  }

  setAuthCookie(res, user._id);

  void getOrCreateWalletForUser(user._id).catch((err) => {
    // eslint-disable-next-line no-console
    console.error("[wallet] Failed to create wallet:", err?.message || err);
  });

  const userWithSecrets = await User.findById(user._id).select(
    "+emailVerificationTokenHash +emailVerificationExpires"
  );
  const rawToken = await assignVerificationToken(userWithSecrets);

  let verifyPayload = {};
  try {
    const delivery = await deliverVerificationEmail({ user: userWithSecrets, rawToken });
    if (delivery.verifyUrl) {
      verifyPayload = { verifyUrl: delivery.verifyUrl, devNote: delivery.devNote };
    }
  } catch {
    verifyPayload = {
      mailError: "We could not send the verification email. You can resend it from the verification page."
    };
  }

  void sendWelcomeEmail({ to: emailNorm, fullName: fullNameNorm }).catch((err) => {
    // eslint-disable-next-line no-console
    console.error("[mail] Welcome email failed:", err?.message || err);
  });

  return res.status(201).json({
    user: user.toPublicJSON(),
    message: "Account created. Please verify your email address.",
    ...verifyPayload
  });
}

export async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: formatZodError(parsed.error) });
  }

  const { identifier, password } = parsed.data;
  const query = normalizeLoginEmail(identifier);

  const user = await User.findOne(query).select("+passwordHash");
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  setAuthCookie(res, user._id);
  return res.json({ user: user.toPublicJSON() });
}

export async function logout(_req, res) {
  clearAuthCookie(res);
  return res.json({ ok: true });
}

export async function me(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return res.json({ user: req.user.toPublicJSON() });
}

export async function updateProfile(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: formatZodError(parsed.error) });
  }

  req.user.fullName = normalizeFullName(parsed.data.fullName);
  if (parsed.data.nationalId !== undefined) {
    req.user.nationalId = parsed.data.nationalId || "";
  }
  if (parsed.data.dateOfBirth !== undefined) {
    req.user.dateOfBirth = parsed.data.dateOfBirth || "";
  }
  await req.user.save();

  return res.json({ user: req.user.toPublicJSON() });
}

export async function forgotPassword(req, res) {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: formatZodError(parsed.error) });
  }

  const emailNorm = parsed.data.email.trim().toLowerCase();
  const user = await User.findOne({ email: emailNorm }).select("+resetPasswordTokenHash +resetPasswordExpires");

  const generic = {
    message:
      "If an account exists for that email, we sent password reset instructions. Check your inbox."
  };

  if (!user) {
    return res.json(generic);
  }

  const rawToken = createResetToken();
  user.resetPasswordTokenHash = hashResetToken(rawToken);
  user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_MS);
  await user.save();

  const clientOrigin = getClientOrigin();
  const resetUrl = `${clientOrigin}/reset-password?token=${rawToken}`;
  const expiresMinutes = Math.round(RESET_TOKEN_MS / 60_000);

  if (isMailConfigured()) {
    try {
      await sendPasswordResetEmail({
        to: emailNorm,
        fullName: user.getFullName(),
        resetUrl,
        expiresMinutes
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[mail] Password reset email failed:", err?.message || err);
      if (shouldExposeResetLinkInResponse()) {
        logResetLinkDev(emailNorm, resetUrl);
        return res.json({
          ...generic,
          resetUrl,
          devNote: "SMTP send failed; reset link included for local debugging."
        });
      }
      return res.status(503).json({
        error: "We could not send the reset email right now. Please try again in a few minutes."
      });
    }
    return res.json(generic);
  }

  if (shouldExposeResetLinkInResponse()) {
    logResetLinkDev(emailNorm, resetUrl);
    return res.json({
      ...generic,
      resetUrl,
      devNote: "SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in .env to send real emails."
    });
  }

  // eslint-disable-next-line no-console
  console.warn(`[auth] Password reset for ${emailNorm} but SMTP is not configured (link not emailed).`);
  return res.json(generic);
}

export async function resetPassword(req, res) {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: formatZodError(parsed.error) });
  }

  const { token, password } = parsed.data;
  const tokenHash = hashResetToken(token);

  const user = await User.findOne({
    resetPasswordTokenHash: tokenHash,
    resetPasswordExpires: { $gt: new Date() }
  }).select("+passwordHash +resetPasswordTokenHash +resetPasswordExpires");

  if (!user) {
    return res.status(400).json({ error: "Reset link is invalid or has expired" });
  }

  user.passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  user.resetPasswordTokenHash = null;
  user.resetPasswordExpires = null;
  await user.save();

  void sendPasswordChangedEmail({ to: user.email, fullName: user.getFullName() }).catch((err) => {
    // eslint-disable-next-line no-console
    console.error("[mail] Password changed email failed:", err?.message || err);
  });

  setAuthCookie(res, user._id);
  return res.json({ user: user.toPublicJSON(), message: "Password updated successfully" });
}

export async function verifyEmail(req, res) {
  const parsed = verifyEmailSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: formatZodError(parsed.error) });
  }

  const tokenHash = hashVerificationToken(parsed.data.token);
  const user = await User.findOne({
    emailVerificationTokenHash: tokenHash,
    emailVerificationExpires: { $gt: new Date() }
  }).select("+emailVerificationTokenHash +emailVerificationExpires");

  if (!user) {
    return res.status(400).json({ error: "Verification link is invalid or has expired" });
  }

  if (req.user && String(req.user._id) !== String(user._id)) {
    return res.status(403).json({ error: "This verification link belongs to another account" });
  }

  user.emailVerified = true;
  user.emailVerificationTokenHash = null;
  user.emailVerificationExpires = null;
  await user.save();

  setAuthCookie(res, user._id);
  return res.json({
    user: user.toPublicJSON(),
    message: "Email verified successfully"
  });
}

export async function resendVerification(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.user.emailVerified) {
    return res.json({ message: "Your email is already verified", user: req.user.toPublicJSON() });
  }

  const user = await User.findById(req.user._id).select(
    "+emailVerificationTokenHash +emailVerificationExpires"
  );
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const rawToken = await assignVerificationToken(user);

  try {
    const delivery = await deliverVerificationEmail({ user, rawToken });
    const payload = {
      message: "Verification email sent. Please check your inbox."
    };
    if (delivery.verifyUrl) {
      return res.json({ ...payload, verifyUrl: delivery.verifyUrl, devNote: delivery.devNote });
    }
    return res.json(payload);
  } catch {
    return res.status(503).json({
      error: "We could not send the verification email right now. Please try again in a few minutes."
    });
  }
}
