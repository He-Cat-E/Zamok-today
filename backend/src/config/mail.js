const truthy = (v) => /^(1|true|yes|on)$/i.test(String(v || "").trim());

export function getClientOrigin() {
  return String(process.env.CLIENT_ORIGIN || "http://localhost:3000").split(",")[0].trim();
}

export function getSiteName() {
  return String(process.env.MAIL_SITE_NAME || "Zamok Today").trim() || "Zamok Today";
}

export function getMailFrom() {
  const from = String(process.env.MAIL_FROM || "").trim();
  if (from) return from;
  const user = String(process.env.SMTP_USER || "").trim();
  const name = getSiteName();
  if (user) return `"${name}" <${user}>`;
  return `"${name}" <noreply@localhost>`;
}

export function isMailConfigured() {
  if (truthy(process.env.MAIL_DISABLED)) return false;
  const host = String(process.env.SMTP_HOST || "").trim();
  const user = String(process.env.SMTP_USER || "").trim();
  const pass = String(process.env.SMTP_PASS || process.env.SMTP_PASSWORD || "").trim();
  return Boolean(host && user && pass);
}

export function getSmtpConfig() {
  const port = Number(process.env.SMTP_PORT || 587);
  const secure =
    truthy(process.env.SMTP_SECURE) || port === 465;

  return {
    host: String(process.env.SMTP_HOST || "").trim(),
    port,
    secure,
    auth: {
      user: String(process.env.SMTP_USER || "").trim(),
      pass: String(process.env.SMTP_PASS || process.env.SMTP_PASSWORD || "").trim()
    }
  };
}
