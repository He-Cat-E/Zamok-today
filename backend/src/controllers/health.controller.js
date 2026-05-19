import { verifyNetgsmCredentials } from "../services/netgsm.service.js";

export function health(_req, res) {
  res.json({ ok: true });
}

export async function netgsm(_req, res) {
  const result = await verifyNetgsmCredentials();
  res.status(result.ok ? 200 : 503).json(result);
}
