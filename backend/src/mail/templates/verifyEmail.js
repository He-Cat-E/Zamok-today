import {
  escapeHtml,
  renderEmailLayout,
  renderMutedBox,
  renderPrimaryButton
} from "./layout.js";
import { emailGreetingName } from "./displayName.js";

export function buildVerifyEmail({ siteName, clientOrigin, fullName, verifyUrl, expiresHours = 24 }) {
  const displayName = emailGreetingName(fullName);
  const safeName = escapeHtml(displayName);
  const safeUrl = escapeHtml(verifyUrl);

  const bodyHtml = `
<h1 style="margin:0 0 12px 0;font-size:26px;font-weight:800;letter-spacing:-0.03em;color:#18181b;line-height:1.25;">
  Verify your email
</h1>
<p style="margin:0 0 8px 0;font-size:15px;line-height:1.65;color:#3f3f46;">
  Hi ${safeName}, thanks for signing up for <strong>${escapeHtml(siteName)}</strong>. Please confirm your email address to secure your account.
</p>
<p style="margin:0;font-size:15px;line-height:1.65;color:#3f3f46;">
  This link expires in <strong>${expiresHours} hours</strong>.
</p>
${renderPrimaryButton(verifyUrl, "Verify email")}
${renderMutedBox(`
  <p style="margin:0 0 8px 0;"><strong>Button not working?</strong> Copy and paste this link:</p>
  <p style="margin:0;word-break:break-all;"><a href="${safeUrl}" style="color:#C32C2B;text-decoration:underline;">${safeUrl}</a></p>
`)}
<p style="margin:24px 0 0 0;font-size:13px;line-height:1.6;color:#71717a;">
  If you did not create an account, you can ignore this email.
</p>`;

  const html = renderEmailLayout({
    preheader: `Confirm your ${siteName} email address.`,
    title: `Verify your email — ${siteName}`,
    siteName,
    clientOrigin,
    bodyHtml,
    footerNote: "You received this email to confirm your email address."
  });

  const text = [
    `Verify your email — ${siteName}`,
    "",
    `Hi ${displayName},`,
    "",
    "Please confirm your email address by opening this link:",
    verifyUrl,
    "",
    `This link expires in ${expiresHours} hours.`,
    "",
    "If you did not create an account, ignore this email."
  ].join("\n");

  return {
    subject: `Verify your ${siteName} email`,
    html,
    text
  };
}
