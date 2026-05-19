import "dotenv/config";

const usercode = String(process.env.NETGSM_USER || "").trim();
const password = String(process.env.NETGSM_PASSWORD || "").trim();
const header = String(process.env.NETGSM_HEADER || "").trim();
const appkey = String(process.env.NETGSM_APPKEY || "").trim();

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<mainbody>
  <header>
    <company dil="TR">Netgsm</company>
    <usercode>${usercode}</usercode>
    <password>${password}</password>
    <type>1:n</type>
    <msgheader>${header}</msgheader>
    <startdate></startdate>
    <stopdate></stopdate>
    <bayikodu></bayikodu>
    <filter>0</filter>
    <encoding>TR</encoding>
    <appkey>${appkey}</appkey>
  </header>
  <body>
    <msg><![CDATA[test]]></msg>
    <no> 5320000000 </no>
  </body>
</mainbody>`;

const res = await fetch("https://api.netgsm.com.tr/sms/send/xml", {
  method: "POST",
  headers: { "Content-Type": "text/xml" },
  body: xml
});
console.log("php-style xml:", (await res.text()).trim());
