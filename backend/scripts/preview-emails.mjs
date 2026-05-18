/**
 * Write sample HTML emails to backend/tmp/email-previews/ for local review.
 * Run: node scripts/preview-emails.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildPasswordResetEmail } from "../src/mail/templates/passwordReset.js";
import { buildWelcomeEmail } from "../src/mail/templates/welcome.js";
import { buildPasswordChangedEmail } from "../src/mail/templates/passwordChanged.js";
import { buildVerifyEmail } from "../src/mail/templates/verifyEmail.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "tmp", "email-previews");
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:3000";
const siteName = process.env.MAIL_SITE_NAME || "Zamok Today";

const samples = [
  ["password-reset.html", buildPasswordResetEmail({
    siteName,
    clientOrigin,
    fullName: "Alex Morgan",
    resetUrl: `${clientOrigin}/reset-password?token=preview-token`,
    expiresMinutes: 60
  }).html],
  ["welcome.html", buildWelcomeEmail({
    siteName,
    clientOrigin,
    fullName: "Alex Morgan"
  }).html],
  ["password-changed.html", buildPasswordChangedEmail({
    siteName,
    clientOrigin,
    fullName: "Alex Morgan"
  }).html],
  ["verify-email.html", buildVerifyEmail({
    siteName,
    clientOrigin,
    fullName: "Alex Morgan",
    verifyUrl: `${clientOrigin}/verify-email?token=preview-token`,
    expiresHours: 24
  }).html]
];

fs.mkdirSync(outDir, { recursive: true });
for (const [name, html] of samples) {
  fs.writeFileSync(path.join(outDir, name), html, "utf8");
}
// eslint-disable-next-line no-console
console.log(`Wrote ${samples.length} previews to ${outDir}`);
