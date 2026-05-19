import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Path to Google Cloud service account JSON (Vision API). */
export const GOOGLE_APPLICATION_CREDENTIALS =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  path.resolve(__dirname, "../../service_account.json");

export const ID_SCAN_MAX_BYTES = 5 * 1024 * 1024;

export const ID_SCAN_ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
