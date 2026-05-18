import { escapeHtml, renderEmailLayout, renderPrimaryButton, renderMutedBox } from "./layout.js";
import { emailGreetingName } from "./displayName.js";

export function buildWelcomeEmail({ siteName, clientOrigin, fullName }) {
  const greeting = emailGreetingName(fullName);
  const safeUser = escapeHtml(greeting === "there" ? "traveler" : greeting);
  const homeUrl = clientOrigin.replace(/\/$/, "");

  const bodyHtml = `
<h1 style="margin:0 0 12px 0;font-size:26px;font-weight:800;letter-spacing:-0.03em;color:#18181b;line-height:1.25;">
  Welcome aboard
</h1>
<p style="margin:0 0 8px 0;font-size:15px;line-height:1.65;color:#3f3f46;">
  Hi ${safeUser}, thanks for joining <strong>${escapeHtml(siteName)}</strong>. Your account is ready.
</p>
<p style="margin:0;font-size:15px;line-height:1.65;color:#3f3f46;">
  Search flights, explore destinations on the map, and compare travel insurance — all in one place.
</p>
${renderPrimaryButton(homeUrl, "Start exploring")}
${renderMutedBox(`
  <p style="margin:0 0 10px 0;font-weight:700;color:#3f3f46;">Quick tips</p>
  <ul style="margin:0;padding-left:18px;color:#52525b;font-size:14px;line-height:1.6;">
    <li style="margin-bottom:6px;">Use the flight search on the homepage to compare routes.</li>
    <li style="margin-bottom:6px;">Open the map to discover fares from your city.</li>
    <li>Sign in anytime to manage your profile from the top bar.</li>
  </ul>
`)}
<p style="margin:24px 0 0 0;font-size:13px;line-height:1.6;color:#71717a;">
  Need help? Reply to this email or visit our support page from the site header.
</p>`;

  const html = renderEmailLayout({
    preheader: `Welcome to ${siteName} — your account is ready.`,
    title: `Welcome to ${siteName}`,
    siteName,
    clientOrigin,
    bodyHtml
  });

  const text = [
    `Welcome to ${siteName}!`,
    "",
    `Hi ${greeting === "there" ? "traveler" : greeting},`,
    "",
    "Thanks for creating an account. You're all set to search flights and explore destinations.",
    "",
    `Get started: ${homeUrl}`,
    "",
    clientOrigin
  ].join("\n");

  return {
    subject: `Welcome to ${siteName}`,
    html,
    text
  };
}
