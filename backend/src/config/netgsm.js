/** @returns {string} */
function cleanEnv(value) {
  return String(value || "")
    .trim()
    .replace(/^\uFEFF/, "")
    .replace(/^['"]|['"]$/g, "");
}

export function isNetgsmConfigured() {
  if (process.env.NETGSM_DISABLED === "true") return false;
  const { usercode, password, header } = netgsmConfig();
  return Boolean(usercode && password && header);
}

/**
 * NetGSM (official PHP package: NETGSM_USERCODE + NETGSM_PASSWORD + NETGSM_HEADER):
 * - usercode: abone numarası (e.g. 8503055987), no leading 0
 * - password: API alt kullanıcı şifresi (NOT main panel login password)
 * - header: onaylı gönderici adı
 * - appkey: optional, from NetGSM panel → API İşlemleri (if your account uses it)
 * - restUsername: optional; REST Basic auth user if different from usercode
 */
export function netgsmConfig() {
  const usercode = cleanEnv(
    process.env.NETGSM_USERCODE || process.env.NETGSM_USER || process.env.NETGSM_USERNAME
  );
  const password = cleanEnv(process.env.NETGSM_PASSWORD);
  const header = cleanEnv(process.env.NETGSM_HEADER || process.env.NETGSM_MSGHEADER);
  const appkey = cleanEnv(process.env.NETGSM_APPKEY);
  const restUsername = cleanEnv(process.env.NETGSM_REST_USERNAME) || usercode;
  return { usercode, password, header, appkey, restUsername };
}

export function shouldExposePhoneOtpInResponse() {
  return process.env.NODE_ENV !== "production" || process.env.EXPOSE_PHONE_OTP === "true";
}

/** Allow OTP in API response when NetGSM returns 30 (misconfigured account / IP block). */
export function isNetgsmDevFallbackAllowed() {
  if (process.env.NETGSM_DEV_FALLBACK === "true") return true;
  if (process.env.NETGSM_DEV_FALLBACK === "false") return false;
  return process.env.NODE_ENV !== "production";
}

/** @param {string} code @param {string} [publicIp] */
export function netgsmErrorMessage(code, publicIp) {
  const c = String(code || "").trim();
  const ipHint = publicIp
    ? ` Add this server's public IP to NetGSM: Ayarlar → API İşlemleri → IP sınırlandırma → ${publicIp}`
    : " If IP restriction is enabled in NetGSM, whitelist your server's public IP under Ayarlar → API İşlemleri.";

  const messages = {
    "20": "SMS message text is invalid or too long.",
    "30":
      "NetGSM error 30: invalid usercode/password, API access not enabled, or your IP is not whitelisted." +
      ipHint +
      " Use NETGSM_USERCODE (abone no), NETGSM_PASSWORD (API alt user password), enable API access for that sub-user, and confirm NETGSM_HEADER is approved.",
    "40": "SMS sender title (NETGSM_HEADER) is not registered in NetGSM.",
    "41": "SMS sender title (NETGSM_HEADER) is invalid.",
    "50": "Invalid mobile number format for NetGSM.",
    "51": "Invalid mobile number format for NetGSM.",
    "52": "Invalid mobile number format for NetGSM.",
    "60": "No OTP SMS credit on your NetGSM account.",
    "70": "Invalid request to NetGSM. Check phone number and sender title.",
    "80": "NetGSM sending rate limit exceeded.",
    "85": "NetGSM duplicate send rate limit exceeded."
  };
  return messages[c] || `NetGSM SMS failed (code ${c || "unknown"}).`;
}
