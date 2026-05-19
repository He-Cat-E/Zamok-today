const REMEMBER_KEY = "zamok_admin_remember";
const EMAIL_KEY = "zamok_admin_remember_email";

export function readRememberedLogin(): { remember: boolean; email: string } {
  try {
    const remember = localStorage.getItem(REMEMBER_KEY) === "1";
    const email = remember ? localStorage.getItem(EMAIL_KEY) || "" : "";
    return { remember, email };
  } catch {
    return { remember: false, email: "" };
  }
}

export function saveRememberedLogin(remember: boolean, email: string) {
  try {
    if (remember) {
      localStorage.setItem(REMEMBER_KEY, "1");
      localStorage.setItem(EMAIL_KEY, email.trim().toLowerCase());
    } else {
      localStorage.removeItem(REMEMBER_KEY);
      localStorage.removeItem(EMAIL_KEY);
    }
  } catch {
    // ignore
  }
}
