export function digitsOnly(value: string) {
  return String(value || "").replace(/\D/g, "");
}

export function formatCardNumber(value: string) {
  const d = digitsOnly(value).slice(0, 19);
  return d.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function formatExpiry(value: string) {
  const d = digitsOnly(value).slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
}

export function formatCvc(value: string) {
  return digitsOnly(value).slice(0, 4);
}
