import {
  escapeHtml,
  renderEmailLayout,
  renderMutedBox,
  renderPrimaryButton
} from "./layout.js";
import { emailGreetingName } from "./displayName.js";

export function buildPasswordResetEmail({ siteName, clientOrigin, fullName, resetUrl, expiresMinutes = 60 }) {
  const displayName = emailGreetingName(fullName);
  const safeName = escapeHtml(displayName);
  const safeUrl = escapeHtml(resetUrl);

  const bodyHtml = `
<h1 style="margin:0 0 12px 0;font-size:26px;font-weight:800;letter-spacing:-0.03em;color:#18181b;line-height:1.25;">
  Reset your password
</h1>
<p style="margin:0 0 8px 0;font-size:15px;line-height:1.65;color:#3f3f46;">
  Hi ${safeName}, we received a request to reset the password for your ${escapeHtml(siteName)} account.
</p>
<p style="margin:0;font-size:15px;line-height:1.65;color:#3f3f46;">
  Tap the button below to choose a new password. This link expires in <strong>${expiresMinutes} minutes</strong>.
</p>
${renderPrimaryButton(resetUrl, "Reset password")}
${renderMutedBox(`
  <p style="margin:0 0 8px 0;"><strong>Button not working?</strong> Copy and paste this link into your browser:</p>
  <p style="margin:0;word-break:break-all;"><a href="${safeUrl}" style="color:#C32C2B;text-decoration:underline;">${safeUrl}</a></p>
`)}
<p style="margin:24px 0 0 0;font-size:13px;line-height:1.6;color:#71717a;">
  If you did not request a password reset, you can safely ignore this email. Your password will stay the same.
</p>`;

  const html = renderEmailLayout({
    preheader: `Reset your ${siteName} password — link expires in ${expiresMinutes} minutes.`,
    title: `Reset your password — ${siteName}`,
    siteName,
    clientOrigin,
    bodyHtml,
    footerNote: "You received this email because a password reset was requested for your account."
  });

  const text = [
    `Reset your password — ${siteName}`,
    "",
    `Hi ${displayName},`,
    "",
    "We received a request to reset your password.",
    `Open this link (expires in ${expiresMinutes} minutes):`,
    resetUrl,
    "",
    "If you did not request this, ignore this email.",
    "",
    clientOrigin
  ].join("\n");

  return {
    subject: `Reset your ${siteName} password`,
    html,
    text
  };
}
