import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { idDocumentUpload, handleUploadError } from "../middleware/upload.middleware.js";
import * as profileController from "../controllers/profile.controller.js";

const router = Router();

router.post(
  "/scan-id",
  requireAuth,
  idDocumentUpload.single("document"),
  handleUploadError,
  profileController.scanIdDocument
);

export default router;
