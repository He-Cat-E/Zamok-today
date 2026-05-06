export function safeSupportedValuesOf(type) {
  try {
    // Node 20+ / modern runtimes
    // eslint-disable-next-line no-undef
    const vals = Intl?.supportedValuesOf?.(type);
    return Array.isArray(vals) ? vals : [];
  } catch {
    return [];
  }
}

export function flagEmojiFromRegion(regionCode) {
  const code = String(regionCode || "").toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return "🏳️";
  const A = 0x1f1e6;
  return Array.from(code)
    .map((c) => String.fromCodePoint(A + (c.charCodeAt(0) - 65)))
    .join("");
}
