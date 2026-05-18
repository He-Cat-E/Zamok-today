import { Router } from "express";
import * as walletController from "../controllers/wallet.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/me", requireAuth, walletController.getMyWallet);
router.post("/add-funds", requireAuth, walletController.addFunds);

export default router;
