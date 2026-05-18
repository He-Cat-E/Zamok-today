/** Keys used on auth, profile, wallet, and account flows (source: en.json). */
export function isAuthI18nKey(key) {
  return (
    key.startsWith("auth.") ||
    key.startsWith("profile.") ||
    key.startsWith("wallet.") ||
    key.startsWith("account.") ||
    key.startsWith("toast.auth.") ||
    key.startsWith("toast.wallet.") ||
    key === "nav.login" ||
    key === "nav.logout" ||
    key === "nav.profile" ||
    key === "nav.wallet" ||
    key === "nav.home"
  );
}

export function pickAuthStringsFromEn(enDict) {
  return Object.fromEntries(Object.entries(enDict).filter(([k]) => isAuthI18nKey(k)));
}
