const BRAND = "#C32C2B";
const BRAND_DARK = "#9E2423";
const INK = "#18181b";
const MUTED = "#71717a";
const BORDER = "#e4e4e7";
const SURFACE = "#ffffff";
const PAGE_BG = "#f4f4f5";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Table-based, inline-styled layout for broad email client support.
 */
export function renderEmailLayout({
  preheader,
  title,
  siteName,
  clientOrigin,
  bodyHtml,
  footerNote
}) {
  const year = new Date().getFullYear();
  const logoUrl = `${clientOrigin.replace(/\/$/, "")}/logo.png`;
  const safeTitle = escapeHtml(title);
  const safeSite = escapeHtml(siteName);
  const safePreheader = escapeHtml(preheader);
  const safeFooter = footerNote ? escapeHtml(footerNote) : "";

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${safeTitle}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap');
    body, table, td { font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    a { color: ${BRAND}; }
    @media only screen and (max-width: 620px) {
      .shell { width: 100% !important; }
      .px { padding-left: 20px !important; padding-right: 20px !important; }
      .hero-pad { padding: 28px 20px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;width:100%;background-color:${PAGE_BG};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
    ${safePreheader}
  </div>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${PAGE_BG};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" class="shell" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:600px;">
          <tr>
            <td style="padding:0 8px 20px 8px;text-align:center;">
              <a href="${escapeHtml(clientOrigin)}" style="text-decoration:none;display:inline-block;">
                <img src="${escapeHtml(logoUrl)}" width="48" height="48" alt="${safeSite}" style="display:block;border:0;border-radius:12px;margin:0 auto 10px auto;" />
              </a>
              <div style="font-size:20px;font-weight:800;letter-spacing:-0.02em;color:${INK};line-height:1.2;">
                ${safeSite}
              </div>
              <div style="font-size:13px;color:${MUTED};margin-top:4px;">Flights &amp; travel, simplified</div>
            </td>
          </tr>
          <tr>
            <td style="border-radius:20px;overflow:hidden;box-shadow:0 12px 40px rgba(24,24,27,0.08);">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${SURFACE};border:1px solid ${BORDER};">
                <tr>
                  <td style="height:4px;background:linear-gradient(90deg, ${BRAND_DARK} 0%, ${BRAND} 50%, #E07A79 100%);font-size:0;line-height:0;">&nbsp;</td>
                </tr>
                <tr>
                  <td class="hero-pad px" style="padding:36px 40px 32px 40px;">
                    ${bodyHtml}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="px" style="padding:24px 12px 8px 12px;text-align:center;font-size:12px;line-height:1.6;color:${MUTED};">
              ${safeFooter ? `<p style="margin:0 0 8px 0;">${safeFooter}</p>` : ""}
              <p style="margin:0 0 6px 0;">
                &copy; ${year} ${safeSite}. All rights reserved.
              </p>
              <p style="margin:0;">
                <a href="${escapeHtml(clientOrigin)}" style="color:${MUTED};text-decoration:underline;">Visit website</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function renderPrimaryButton(href, label) {
  const safeHref = escapeHtml(href);
  const safeLabel = escapeHtml(label);
  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 8px 0;">
  <tr>
    <td align="center" style="border-radius:12px;background:${BRAND};">
      <!--[if mso]>
      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${safeHref}" style="height:48px;v-text-anchor:middle;width:260px;" arcsize="18%" strokecolor="${BRAND}" fillcolor="${BRAND}">
        <w:anchorlock/>
        <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">${safeLabel}</center>
      </v:roundrect>
      <![endif]-->
      <!--[if !mso]><!-->
      <a href="${safeHref}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:12px;background:${BRAND};letter-spacing:0.01em;">
        ${safeLabel}
      </a>
      <!--<![endif]-->
    </td>
  </tr>
</table>`;
}

export function renderMutedBox(html) {
  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:24px;">
  <tr>
    <td style="padding:14px 16px;background:#fafafa;border:1px solid ${BORDER};border-radius:12px;font-size:13px;line-height:1.55;color:${MUTED};">
      ${html}
    </td>
  </tr>
</table>`;
}

export { escapeHtml, BRAND };
