import "dotenv/config";
import {
  verifyNetgsmCredentials,
  sendPhoneOtpSms
} from "../src/services/netgsm.service.js";
import { netgsmConfig } from "../src/config/netgsm.js";

const { usercode, header } = netgsmConfig();
console.log("NETGSM_USER / USERCODE length:", usercode.length);
console.log("NETGSM_HEADER:", header);
console.log("");

const check = await verifyNetgsmCredentials();
console.log("Credential check:", check.ok ? "OK" : "FAILED");
console.log(check);
if (check.publicIp) {
  console.log("\nIf code 30: open NetGSM → Ayarlar → API İşlemleri");
  console.log("  1) Enable API access for your API sub-user");
  console.log("  2) Add IP to whitelist:", check.publicIp);
  console.log("  3) Confirm password is API sub-user password (not panel login)");
}

if (process.argv.includes("--send")) {
  console.log("\nSending test SMS to 5320000000 (dry-run number)...");
  try {
    const res = await sendPhoneOtpSms({ phoneDigits: "905320000000", code: "123456" });
    console.log("Send OK:", res);
  } catch (e) {
    console.error("Send failed:", e.message);
    if (e.attempts) console.error("Attempts:", e.attempts);
  }
}
