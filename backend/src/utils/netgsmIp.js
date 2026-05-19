let cachedPublicIp = null;

export async function getServerPublicIp() {
  if (cachedPublicIp) return cachedPublicIp;
  try {
    const res = await fetch("https://api.ipify.org?format=json", {
      signal: AbortSignal.timeout(5000)
    });
    if (!res.ok) return null;
    const data = await res.json();
    const ip = String(data?.ip || "").trim();
    if (ip) cachedPublicIp = ip;
    return ip || null;
  } catch {
    return null;
  }
}
