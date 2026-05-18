import { escapeHtml, renderEmailLayout, renderPrimaryButton } from "./layout.js";
import { emailGreetingName } from "./displayName.js";

export function buildPasswordChangedEmail({ siteName, clientOrigin, fullName }) {
  const safeUser = escapeHtml(emailGreetingName(fullName));
  const loginUrl = `${clientOrigin.replace(/\/$/, "")}/login`;

  const bodyHtml = `
<h1 style="margin:0 0 12px 0;font-size:26px;font-weight:800;letter-spacing:-0.03em;color:#18181b;line-height:1.25;">
  Password updated
</h1>
<p style="margin:0 0 8px 0;font-size:15px;line-height:1.65;color:#3f3f46;">
  Hi ${safeUser}, your ${escapeHtml(siteName)} password was changed successfully.
</p>
<p style="margin:0;font-size:15px;line-height:1.65;color:#3f3f46;">
  If you made this change, no further action is needed. You can sign in with your new password.
</p>
${renderPrimaryButton(loginUrl, "Sign in")}
<p style="margin:24px 0 0 0;font-size:13px;line-height:1.6;color:#71717a;">
  <strong>Didn't change your password?</strong> Contact support immediately and secure your account.
</p>`;

  const html = renderEmailLayout({
    preheader: `Your ${siteName} password was changed.`,
    title: `Password updated — ${siteName}`,
    siteName,
    clientOrigin,
    bodyHtml,
    footerNote: "Security notice: password change confirmation."
  });

  const text = [
    `Your ${siteName} password was updated`,
    "",
    `Hi ${emailGreetingName(fullName)},`,
    "",
    "Your password was changed successfully.",
    `Sign in: ${loginUrl}`,
    "",
    "If you did not make this change, contact support immediately."
  ].join("\n");

  return {
    subject: `Your ${siteName} password was updated`,
    html,
    text
  };
}
