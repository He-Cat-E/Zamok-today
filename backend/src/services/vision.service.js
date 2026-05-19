import vision from "@google-cloud/vision";
import { GOOGLE_APPLICATION_CREDENTIALS } from "../config/vision.js";
import { parseTurkishIdCardText } from "../utils/turkishIdParser.js";
import { linesFromFullTextAnnotation } from "../utils/visionLayout.js";

let client;

function getClient() {
  if (!client) {
    client = new vision.ImageAnnotatorClient({
      keyFilename: GOOGLE_APPLICATION_CREDENTIALS
    });
  }
  return client;
}

function mergeText(...parts) {
  const seen = new Set();
  const chunks = [];
  for (const p of parts) {
    const t = String(p || "").trim();
    if (!t || seen.has(t)) continue;
    seen.add(t);
    chunks.push(t);
  }
  return chunks.join("\n");
}

/**
 * Runs Google Cloud Vision OCR (document + text detection) and parses Turkish ID fields.
 */
export async function detectPersonalDataFromImage(buffer) {
  const annotator = getClient();

  const [docResult, textResult] = await Promise.all([
    annotator.documentTextDetection({ image: { content: buffer } }),
    annotator.textDetection({ image: { content: buffer } })
  ]);

  const docAnnotation = docResult[0]?.fullTextAnnotation;
  const textAnnotation = textResult[0]?.fullTextAnnotation;

  const docText = docAnnotation?.text?.trim() || "";
  const plainText = textAnnotation?.text?.trim() || "";
  const mergedText = mergeText(docText, plainText);

  const layoutLines = mergeLinesFromAnnotations(docAnnotation, textAnnotation);

  if (!mergedText && !layoutLines.length) {
    return emptyResult();
  }

  const parsed = parseTurkishIdCardText(mergedText, layoutLines);
  const { rawText: _omit, ...publicFields } = parsed;
  return publicFields;
}

function mergeLinesFromAnnotations(...annotations) {
  const seen = new Set();
  const out = [];
  for (const ann of annotations) {
    if (!ann) continue;
    for (const line of linesFromFullTextAnnotation(ann)) {
      const key = line.toLocaleUpperCase("tr-TR");
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(line);
    }
  }
  return out;
}

function emptyResult() {
  return {
    nationalId: "",
    dateOfBirth: "",
    nationalIdValid: false,
    confidence: "low"
  };
}
