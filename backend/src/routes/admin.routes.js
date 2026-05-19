import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";
import * as adminUsersController from "../controllers/adminUsers.controller.js";
import { requireAdminAuth } from "../middleware/adminAuth.middleware.js";

const router = Router();

router.post("/auth/login", adminController.login);
router.post("/auth/logout", adminController.logout);
router.get("/auth/me", requireAdminAuth, adminController.me);

router.get("/users", requireAdminAuth, adminUsersController.listUsersDataTable);
router.get("/users/:id/wallet", requireAdminAuth, adminUsersController.getUserWallet);
router.patch(
  "/users/:id/account-status",
  requireAdminAuth,
  adminUsersController.updateUserAccountStatus
);

export default router;
