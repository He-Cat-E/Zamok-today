import multer from "multer";
import { ID_SCAN_ALLOWED_MIME, ID_SCAN_MAX_BYTES } from "../config/vision.js";

const storage = multer.memoryStorage();

export const idDocumentUpload = multer({
  storage,
  limits: { fileSize: ID_SCAN_MAX_BYTES, files: 1 },
  fileFilter(_req, file, cb) {
    if (!ID_SCAN_ALLOWED_MIME.has(file.mimetype)) {
      cb(new Error("Only JPEG, PNG, or WebP images are allowed"));
      return;
    }
    cb(null, true);
  }
});

export function handleUploadError(err, _req, res, next) {
  if (!err) return next();
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "Image must be 5 MB or smaller" });
  }
  return res.status(400).json({
    error: err instanceof Error ? err.message : "Invalid upload"
  });
}
