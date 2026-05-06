import { Router } from "express";
import * as localeController from "../controllers/locale.controller.js";

const router = Router();

router.get("/options", localeController.getOptions);
router.get("/whereami", localeController.getWhereAmI);
router.get("/preferences/:deviceId", localeController.getPreference);
router.put("/preferences", localeController.upsertPreference);

export default router;
