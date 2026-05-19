import "dotenv/config";

function clean(value) {
  return String(value || "")
    .trim()
    .replace(/^\uFEFF/, "")
    .replace(/^['"]|['"]$/g, "");
}

const usercode = clean(process.env.NETGSM_USER);
const password = clean(process.env.NETGSM_PASSWORD);
const header = clean(process.env.NETGSM_HEADER);

function mask(s) {
  return `${"*".repeat(Math.max(0, s.length - 2))}${s.slice(-2)}`;
}

console.log("usercode", usercode, "len", usercode.length);
console.log("password", mask(password), "len", password.length, "lastCharCode", password.charCodeAt(password.length - 1));
console.log("header", header);

async function balance(stip) {
  const res = await fetch("https://api.netgsm.com.tr/balance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usercode, password, stip })
  });
  const data = await res.json().catch(() => ({}));
  return { stip, status: res.status, data };
}

async function getSms() {
  const url = new URL("https://api.netgsm.com.tr/sms/send/get");
  url.searchParams.set("usercode", usercode);
  url.searchParams.set("password", password);
  url.searchParams.set("gsmno", "5320000000");
  url.searchParams.set("message", "test");
  url.searchParams.set("msgheader", header);
  url.searchParams.set("dil", "TR");
  const res = await fetch(url);
  const text = await res.text();
  return { status: res.status, text: text.trim().slice(0, 80) };
}

async function restWithBodyCreds() {
  const res = await fetch("https://api.netgsm.com.tr/sms/rest/v2/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      usercode,
      password,
      msgheader: header,
      encoding: "TR",
      messages: [{ msg: "test", no: "5320000000" }]
    })
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

async function restBasic() {
  const token = Buffer.from(`${usercode}:${password}`).toString("base64");
  const res = await fetch("https://api.netgsm.com.tr/sms/rest/v2/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${token}`
    },
    body: JSON.stringify({
      msgheader: header,
      encoding: "TR",
      messages: [{ msg: "test", no: "5320000000" }]
    })
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

async function headersApi() {
  const token = Buffer.from(`${usercode}:${password}`).toString("base64");
  const res = await fetch("https://api.netgsm.com.tr/sms/rest/v2/msgheader", {
    method: "GET",
    headers: { Authorization: `Basic ${token}` }
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

console.log("\n--- balance ---");
for (const stip of [1, 2, "1", "2"]) {
  console.log(await balance(stip));
}

console.log("\n--- GET sms ---");
console.log(await getSms());

console.log("\n--- REST body creds ---");
console.log(await restWithBodyCreds());

console.log("\n--- REST basic ---");
console.log(await restBasic());

console.log("\n--- msgheader list ---");
console.log(await headersApi());
