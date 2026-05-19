import Netgsm from "@netgsm/sms";
import {
  isNetgsmConfigured,
  isNetgsmDevFallbackAllowed,
  netgsmConfig,
  netgsmErrorMessage
} from "../config/netgsm.js";
import { phoneForSmsApi } from "../utils/phone.js";
import { getServerPublicIp } from "../utils/netgsmIp.js";

let restClient;

function getRestClient() {
  if (!isNetgsmConfigured()) return null;
  if (!restClient) {
    const { restUsername, password } = netgsmConfig();
    restClient = new Netgsm({ username: restUsername, password });
  }
  return restClient;
}

export function parseNetgsmPlainResponse(raw) {
  const text = String(raw || "").trim();
  const first = text.split(/\s+/)[0] || text;
  return { code: first, raw: text };
}

async function assertNetgsmSuccess(code, source) {
  if (code === "00" || code === "0") return;
  const publicIp = await getServerPublicIp();
  const err = new Error(netgsmErrorMessage(code, publicIp));
  err.netgsmCode = code;
  throw err;
}

function escapeXml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Official NetGSM PHP package XML shape (filter + encoding required for many accounts).
 */
async function sendViaXmlApi({ smsNo, header, message }) {
  const { usercode, password, appkey } = netgsmConfig();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<mainbody>
  <header>
    <company dil="TR">Netgsm</company>
    <usercode>${escapeXml(usercode)}</usercode>
    <password>${escapeXml(password)}</password>
    <type>1:n</type>
    <msgheader>${escapeXml(header)}</msgheader>
    <startdate></startdate>
    <stopdate></stopdate>
    <bayikodu></bayikodu>
    <filter>0</filter>
    <encoding>TR</encoding>
    <appkey>${escapeXml(appkey)}</appkey>
  </header>
  <body>
    <msg><![CDATA[${message.replace(/]]>/g, "]]]]><![CDATA[>")}]]></msg>
    <no> ${escapeXml(smsNo)} </no>
  </body>
</mainbody>`;

  const res = await fetch("https://api.netgsm.com.tr/sms/send/xml", {
    method: "POST",
    headers: { "Content-Type": "text/xml; charset=UTF-8" },
    body: xml
  });
  const text = await res.text();
  const parsed = parseNetgsmPlainResponse(text);
  await assertNetgsmSuccess(parsed.code, "NetGSM XML SMS");
  return { code: parsed.code, jobid: parsed.raw.split(/\s+/)[1], channel: "xml" };
}

async function sendViaGetApi({ smsNo, header, message }) {
  const { usercode, password } = netgsmConfig();
  const url = new URL("https://api.netgsm.com.tr/sms/send/get");
  url.searchParams.set("usercode", usercode);
  url.searchParams.set("password", password);
  url.searchParams.set("gsmno", smsNo);
  url.searchParams.set("message", message);
  url.searchParams.set("msgheader", header);
  url.searchParams.set("dil", "TR");
  url.searchParams.set("filter", "0");

  const res = await fetch(url.toString());
  const parsed = parseNetgsmPlainResponse(await res.text());
  await assertNetgsmSuccess(parsed.code, "NetGSM GET SMS");
  return { code: parsed.code, jobid: parsed.raw.split(/\s+/)[1], channel: "get" };
}

async function sendViaRestSms({ smsNo, header, message }) {
  const netgsm = getRestClient();
  if (!netgsm) throw new Error("SMS provider is not configured");

  const response = await netgsm.sendRestSms({
    msgheader: header,
    encoding: "TR",
    messages: [{ msg: message, no: smsNo }]
  });
  return { ...response, channel: "rest-sms" };
}

async function sendViaRestOtp({ smsNo, header, message }) {
  const netgsm = getRestClient();
  if (!netgsm) throw new Error("SMS provider is not configured");

  const response = await netgsm.sendOtpSms({
    msgheader: header,
    msg: message,
    no: smsNo
  });
  return { ...response, channel: "rest-otp" };
}

export async function verifyNetgsmCredentials() {
  if (!isNetgsmConfigured()) {
    return { ok: false, code: "NOT_CONFIGURED", message: "NetGSM env vars are missing" };
  }

  const { usercode, password, appkey } = netgsmConfig();
  const publicIp = await getServerPublicIp();

  try {
    const body = { usercode, password, stip: 2 };
    if (appkey) body.appkey = appkey;

    const res = await fetch("https://api.netgsm.com.tr/balance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    const code = String(data?.code ?? "").trim();

    if (code === "00" || code === "0") {
      return { ok: true, code, publicIp, data };
    }
    return { ok: false, code, publicIp, message: netgsmErrorMessage(code, publicIp) };
  } catch (err) {
    const code = String(err?.code ?? "").trim();
    return {
      ok: false,
      code: code || "ERROR",
      publicIp,
      message: err?.description || err?.message || netgsmErrorMessage(code, publicIp)
    };
  }
}

/**
 * @param {{ phoneDigits: string, code: string }} params
 */
export async function sendPhoneOtpSms({ phoneDigits, code }) {
  const smsNo = phoneForSmsApi(phoneDigits);
  if (!smsNo) {
    throw new Error("Invalid phone number for SMS");
  }

  const { header } = netgsmConfig();
  const message = `Zamok Today dogrulama kodunuz: ${code}. 5 dakika gecerlidir. Kimseyle paylasmayin.`;

  const attempts = [
    { name: "xml", run: () => sendViaXmlApi({ smsNo, header, message }) },
    { name: "get", run: () => sendViaGetApi({ smsNo, header, message }) },
    { name: "rest-sms", run: () => sendViaRestSms({ smsNo, header, message }) },
    { name: "rest-otp", run: () => sendViaRestOtp({ smsNo, header, message }) }
  ];

  const errors = [];
  let lastCode = "30";

  for (const attempt of attempts) {
    try {
      return await attempt.run();
    } catch (err) {
      const netgsmCode = String(err?.netgsmCode ?? err?.code ?? "").trim();
      lastCode = netgsmCode || lastCode;
      const desc = err?.description || err?.message || "unknown error";
      errors.push(`${attempt.name}: ${netgsmCode || desc}`);
      if (netgsmCode === "30" || netgsmCode === "40" || netgsmCode === "41") {
        break;
      }
    }
  }

  const publicIp = await getServerPublicIp();

  if (lastCode === "30" && isNetgsmDevFallbackAllowed()) {
    const err = new Error("NETGSM_DEV_FALLBACK");
    err.netgsmCode = "30";
    err.devFallback = true;
    err.attempts = errors;
    err.publicIp = publicIp;
    throw err;
  }

  const err = new Error(netgsmErrorMessage(lastCode, publicIp));
  err.netgsmCode = lastCode;
  err.attempts = errors;
  err.publicIp = publicIp;
  throw err;
}
