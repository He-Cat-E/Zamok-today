import assert from "node:assert/strict";
import { isValidTurkishNationalId, parseTurkishIdCardText } from "./turkishIdParser.js";

const SAMPLE_FRONT = `
TÜRKİYE CUMHURİYETİ KİMLİK KARTI
REPUBLIC OF TURKEY IDENTITY CARD
T.C. Kimlik No / TR Identity No
12345678901
Soyadı / Surname
YILMAZ
Adı / Name
AHMET
Doğum Tarihi / Date of Birth
15.03.1990
`;

const SAMPLE_INLINE = `
T.C. KIMLIK NO: 98765432109
SOYADI/SURNAME DEMIR
ADI/NAME MEHMET
DOGUM TARIHI 01.07.1985
`;

const SAMPLE_MRZ = `
IDTUR12345678901<<<<<<<<<<<<<<<
8507152M2807152TUR<<<<<<<<<<<4
DEMIR<<MEHMET<<<<<<<<<<<<<<<<<
`;

function testValidTc() {
  assert.equal(isValidTurkishNationalId("12345678901"), false);
  assert.equal(isValidTurkishNationalId("10000000146"), true);
}

function testFrontLayout() {
  const r = parseTurkishIdCardText(SAMPLE_FRONT);
  assert.equal(r.nationalId, "12345678901");
  assert.equal(r.dateOfBirth, "1990-03-15");
  assert.equal(r.fullName, undefined);
}

function testInline() {
  const r = parseTurkishIdCardText(SAMPLE_INLINE);
  assert.equal(r.nationalId, "98765432109");
  assert.equal(r.dateOfBirth, "1985-07-01");
}

function testOcrTcDigits() {
  const r = parseTurkishIdCardText(`
T.C. Kimlik No
1O3456789O1
Dogum Tarihi 15.03.1990
`);
  assert.equal(r.nationalId, "10345678901");
  assert.equal(r.dateOfBirth, "1990-03-15");
}

function testMrz() {
  const r = parseTurkishIdCardText(SAMPLE_MRZ);
  assert.equal(r.nationalId, "12345678901");
  assert.equal(r.dateOfBirth, "1985-07-15");
}

testValidTc();
testFrontLayout();
testInline();
testOcrTcDigits();
testMrz();
console.log("turkishIdParser tests passed");
