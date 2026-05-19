import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import * as phoneAuthController from "../controllers/phoneAuth.controller.js";
import { requireAuth, optionalAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/phone/send-code", phoneAuthController.sendPhoneCode);
router.post("/phone/login", phoneAuthController.loginWithPhone);
router.post("/phone/register", phoneAuthController.registerWithPhone);
router.post("/logout", authController.logout);
router.get("/me", requireAuth, authController.me);
router.patch("/profile", requireAuth, authController.updateProfile);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/verify-email", optionalAuth, authController.verifyEmail);
router.post("/resend-verification", requireAuth, authController.resendVerification);

export default router;
