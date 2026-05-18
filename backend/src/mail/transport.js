import nodemailer from "nodemailer";
import { getSmtpConfig, isMailConfigured } from "../config/mail.js";

let transporter;

export function getMailTransporter() {
  if (!isMailConfigured()) {
    throw new Error("SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in .env");
  }
  if (!transporter) {
    transporter = nodemailer.createTransport(getSmtpConfig());
  }
  return transporter;
}

export async function verifyMailTransport() {
  if (!isMailConfigured()) return { ok: false, reason: "not_configured" };
  const transport = getMailTransporter();
  await transport.verify();
  return { ok: true };
}
