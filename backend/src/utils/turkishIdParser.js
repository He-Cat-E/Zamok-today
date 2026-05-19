/** Validates Turkish Republic ID number (T.C. Kimlik No) checksum. */
export function isValidTurkishNationalId(value) {
  const tc = String(value || "").replace(/\D/g, "");
  if (!/^[1-9]\d{10}$/.test(tc)) return false;

  const d = tc.split("").map(Number);
  const odd = d[0] + d[2] + d[4] + d[6] + d[8];
  const even = d[1] + d[3] + d[5] + d[7];
  const digit10 = (odd * 7 - even) % 10;
  const digit11 = d.slice(0, 10).reduce((sum, n) => sum + n, 0) % 10;

  return digit10 === d[9] && digit11 === d[10];
}

/** Normalize common OCR misreads (ASCII only — avoids Turkish letter replace loops). */
export function normalizeOcrText(text) {
  return String(text || "")
    .replace(/\r/g, "\n")
    .replace(/[|]/g, "I")
    .replace(/[₀ₒ]/g, "0");
}

function cleanLine(line) {
  return normalizeOcrText(line).replace(/\s+/g, " ").trim();
}

function normalizeForMatch(line) {
  return cleanLine(line)
    .toLocaleUpperCase("tr-TR")
    .replace(/İ/g, "I")
    .replace(/Ş/g, "S")
    .replace(/Ğ/g, "G")
    .replace(/Ü/g, "U")
    .replace(/Ö/g, "O")
    .replace(/Ç/g, "C");
}

/** Fix common Vision OCR confusions inside digit runs. */
function digitsFromOcr(raw) {
  return String(raw || "")
    .replace(/[OoQ]/g, "0")
    .replace(/[Il|]/g, "1")
    .replace(/[Zz]/g, "2")
    .replace(/[Ss]/g, "5")
    .replace(/[Bb]/g, "8")
    .replace(/\D/g, "");
}

const RE_DOB_LABEL =
  /(?:DOGUM|DOĞUM)\s*(?:TAR[Iİ]H[Iİ]?)?|DATE\s*OF\s*BIRTH|BIRTH\s*DATE|D\.?\s*TAR[Iİ]H/i;

function parseBirthDateFromFragment(fragment) {
  const s = String(fragment || "");
  const patterns = [
    /\b(\d{2})[.\s/-](\d{2})[.\s/-](\d{4})\b/,
    /\b(\d{2})[.\s/-](\d{2})[.\s/-](\d{2})\b/
  ];

  for (const re of patterns) {
    const m = s.match(re);
    if (!m) continue;
    const dd = Number(m[1]);
    const mm = Number(m[2]);
    let yyyy = Number(m[3]);
    if (yyyy < 100) yyyy += yyyy > 30 ? 1900 : 2000;
    if (dd >= 1 && dd <= 31 && mm >= 1 && mm <= 12 && yyyy >= 1920 && yyyy <= 2015) {
      return `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
    }
  }
  return "";
}

function extractNationalId(text, lines) {
  const labelPatterns = [
    /(?:T\.?\s*C\.?\s*)?(?:K[Iİ]ML[Iİ]K\s*(?:NO|NUMARASI)?|IDENTITY\s*(?:NO|NUMBER)?|TR\s*IDENTITY)[^\dA-Za-z]{0,30}([1-9A-Za-zOIl|][\dA-Za-zOIl|\s.]{9,24})/i,
    /(?:SERIAL\s*NO?|SERI\s*NO)[^\dA-Za-z]{0,20}([1-9A-Za-zOIl|][\dA-Za-zOIl|\s.]{9,24})/i
  ];

  const candidates = [];

  function addCandidate(digits) {
    if (/^[1-9]\d{10}$/.test(digits) && !candidates.includes(digits)) {
      candidates.push(digits);
    }
  }

  for (const re of labelPatterns) {
    const m = text.match(re);
    if (m) addCandidate(digitsFromOcr(m[1]));
  }

  for (const line of lines) {
    addCandidate(digitsFromOcr(line));
    const norm = normalizeForMatch(line);
    if (/(?:TC|KIMLIK|IDENTITY)/.test(norm)) {
      addCandidate(digitsFromOcr(line));
    }
  }

  const blobs = text.match(/[1-9][\d\s.OIl|]{10,22}/gi) || [];
  for (const raw of blobs) addCandidate(digitsFromOcr(raw));

  const valid = candidates.find((d) => isValidTurkishNationalId(d));
  if (valid) return valid;
  return candidates[0] || "";
}

function isMrzDocumentLine(line) {
  return /^ID[A-Z]{3}/.test(line) || /^I[A-Z<]{0,3}[A-Z]{3}\d/.test(line);
}

function parseMrz(text) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim().toUpperCase())
    .filter((l) => l.length >= 20);

  let dateOfBirth = "";
  let nationalId = "";

  for (const line of lines) {
    if (isMrzDocumentLine(line)) {
      const digits = line.replace(/\D/g, "");
      const m11 = digits.match(/[1-9]\d{10}/);
      if (m11 && !nationalId) nationalId = m11[0];
      continue;
    }

    const dobMatch = line.match(/^(\d{2})(\d{2})(\d{2})\d[MF<]/);
    if (dobMatch) {
      const yy = dobMatch[1];
      const mm = dobMatch[2];
      const dd = dobMatch[3];
      const yyyy = Number(yy) > 30 ? `19${yy}` : `20${yy}`;
      if (Number(mm) >= 1 && Number(mm) <= 12 && Number(dd) >= 1 && Number(dd) <= 31) {
        dateOfBirth = `${yyyy}-${mm}-${dd}`;
      }
    }
  }

  if (!nationalId) {
    const idInMrz = text.match(/ID[A-Z]{3}[0-9<]{8,}/);
    if (idInMrz) {
      const digits = idInMrz[0].replace(/\D/g, "");
      const m11 = digits.match(/[1-9]\d{10}/);
      if (m11) nationalId = m11[0];
    }
  }

  return { dateOfBirth, nationalId };
}

function mergeLines(...sources) {
  const seen = new Set();
  const out = [];
  for (const list of sources) {
    for (const line of list || []) {
      const key = normalizeForMatch(line);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(cleanLine(line));
    }
  }
  return out;
}

/**
 * Extract national ID and date of birth from OCR text (Turkish ID card oriented).
 * @param {string} rawText - full OCR text
 * @param {string[]} [layoutLines] - lines from Vision word positions (preferred)
 */
export function parseTurkishIdCardText(rawText, layoutLines = []) {
  const text = normalizeOcrText(rawText);
  const newlineLines = text
    .split(/\n/)
    .map(cleanLine)
    .filter(Boolean);
  const lines = mergeLines(layoutLines, newlineLines);

  const mrz = parseMrz(text);

  let nationalId = extractNationalId(text, lines) || mrz.nationalId;
  let dateOfBirth = mrz.dateOfBirth;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const norm = normalizeForMatch(line);

    if (RE_DOB_LABEL.test(line) || RE_DOB_LABEL.test(norm)) {
      const inline = parseBirthDateFromFragment(line);
      const afterLabel = line.replace(RE_DOB_LABEL, " ");
      const fromLine = inline || parseBirthDateFromFragment(afterLabel);
      const fromNext = parseBirthDateFromFragment(lines[i + 1] || "");
      if (fromLine) dateOfBirth = fromLine;
      else if (fromNext) dateOfBirth = fromNext;
    }
  }

  if (!dateOfBirth) {
    const allDates = [];
    for (const line of lines) {
      const norm = normalizeForMatch(line);
      if (/VALID|GECERL|EXPIR|SON|UNTIL/i.test(norm)) continue;
      const d = parseBirthDateFromFragment(line);
      if (d) allDates.push(d);
    }
    if (allDates.length) {
      allDates.sort();
      dateOfBirth = allDates[0];
    }
  }

  const fieldsFound = [nationalId, dateOfBirth].filter(Boolean).length;

  return {
    nationalId,
    dateOfBirth,
    nationalIdValid: nationalId ? isValidTurkishNationalId(nationalId) : false,
    confidence:
      fieldsFound >= 2 ? "high" : fieldsFound === 1 ? "medium" : "low",
    rawText: text
  };
}
