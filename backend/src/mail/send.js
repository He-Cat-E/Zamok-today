import { getClientOrigin, getMailFrom, getSiteName, isMailConfigured } from "../config/mail.js";
import { getMailTransporter } from "./transport.js";
import { buildPasswordResetEmail } from "./templates/passwordReset.js";
import { buildWelcomeEmail } from "./templates/welcome.js";
import { buildPasswordChangedEmail } from "./templates/passwordChanged.js";
import { buildVerifyEmail } from "./templates/verifyEmail.js";

async function send({ to, subject, html, text }) {
  const transport = getMailTransporter();
  const info = await transport.sendMail({
    from: getMailFrom(),
    to,
    subject,
    html,
    text
  });
  return info;
}

export async function sendPasswordResetEmail({ to, fullName, resetUrl, expiresMinutes = 60 }) {
  if (!isMailConfigured()) return { sent: false, reason: "not_configured" };

  const siteName = getSiteName();
  const clientOrigin = getClientOrigin();
  const { subject, html, text } = buildPasswordResetEmail({
    siteName,
    clientOrigin,
    fullName,
    resetUrl,
    expiresMinutes
  });

  await send({ to, subject, html, text });
  return { sent: true };
}

export async function sendWelcomeEmail({ to, fullName }) {
  if (!isMailConfigured()) return { sent: false, reason: "not_configured" };

  const siteName = getSiteName();
  const clientOrigin = getClientOrigin();
  const { subject, html, text } = buildWelcomeEmail({ siteName, clientOrigin, fullName });

  await send({ to, subject, html, text });
  return { sent: true };
}

export async function sendVerifyEmail({ to, fullName, verifyUrl, expiresHours = 24 }) {
  if (!isMailConfigured()) return { sent: false, reason: "not_configured" };

  const siteName = getSiteName();
  const clientOrigin = getClientOrigin();
  const { subject, html, text } = buildVerifyEmail({
    siteName,
    clientOrigin,
    fullName,
    verifyUrl,
    expiresHours
  });

  await send({ to, subject, html, text });
  return { sent: true };
}

export async function sendPasswordChangedEmail({ to, fullName }) {
  if (!isMailConfigured()) return { sent: false, reason: "not_configured" };

  const siteName = getSiteName();
  const clientOrigin = getClientOrigin();
  const { subject, html, text } = buildPasswordChangedEmail({ siteName, clientOrigin, fullName });

  await send({ to, subject, html, text });
  return { sent: true };
}
