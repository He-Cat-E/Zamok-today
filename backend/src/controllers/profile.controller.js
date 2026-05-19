import { detectPersonalDataFromImage } from "../services/vision.service.js";

export async function scanIdDocument(req, res) {
  if (!req.file?.buffer?.length) {
    return res.status(400).json({ error: "Upload an image of your ID card" });
  }

  try {
    const data = await detectPersonalDataFromImage(req.file.buffer);

    if (!data.nationalId && !data.dateOfBirth) {
      return res.status(422).json({
        error:
          "Could not read personal details from this image. Use a clear, well-lit photo of your ID.",
        data
      });
    }

    return res.json({
      message: "Personal data detected",
      data
    });
  } catch (err) {
    console.error("[vision] ID scan failed:", err?.message || err);
    const msg = err instanceof Error ? err.message : "Vision API request failed";
    if (/ENOENT|credentials|Could not load/i.test(msg)) {
      return res.status(503).json({
        error: "Document scanning is not configured. Contact support."
      });
    }
    return res.status(502).json({ error: "Could not process the image. Try again." });
  }
}
