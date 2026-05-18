export function emailGreetingName(fullName) {
  const name = String(fullName || "").trim();
  return name || "there";
}
