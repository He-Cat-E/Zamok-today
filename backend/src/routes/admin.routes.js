import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";
import * as adminUsersController from "../controllers/adminUsers.controller.js";
import * as adminTransactionsController from "../controllers/adminTransactions.controller.js";
import * as adminAdminsController from "../controllers/adminAdmins.controller.js";
import { requireAdminAuth } from "../middleware/adminAuth.middleware.js";
import {
  requireAdminManagement,
  requireAdminPage
} from "../middleware/adminPageAccess.middleware.js";

const router = Router();

router.post("/auth/login", adminController.login);
router.post("/auth/logout", adminController.logout);
router.get("/auth/me", requireAdminAuth, adminController.me);
router.patch("/auth/profile", requireAdminAuth, adminController.updateProfile);
router.patch("/auth/password", requireAdminAuth, adminController.changePassword);

router.get("/pages", requireAdminAuth, adminAdminsController.listAdminPages);

router.get(
  "/users",
  requireAdminAuth,
  requireAdminPage("users"),
  adminUsersController.listUsersDataTable
);
router.get(
  "/users/:id/wallet",
  requireAdminAuth,
  requireAdminPage("users"),
  adminUsersController.getUserWallet
);
router.patch(
  "/users/:id/account-status",
  requireAdminAuth,
  requireAdminPage("users"),
  adminUsersController.updateUserAccountStatus
);

router.get(
  "/transactions",
  requireAdminAuth,
  requireAdminPage("transactions"),
  adminTransactionsController.listTransactionsDataTable
);

router.get(
  "/admins",
  requireAdminAuth,
  requireAdminManagement,
  adminAdminsController.listAdminsDataTable
);
router.post(
  "/admins",
  requireAdminAuth,
  requireAdminManagement,
  adminAdminsController.createAdminAccount
);
router.patch(
  "/admins/:id",
  requireAdminAuth,
  requireAdminManagement,
  adminAdminsController.updateAdminAccount
);
router.patch(
  "/admins/:id/account-status",
  requireAdminAuth,
  requireAdminManagement,
  adminAdminsController.updateAdminAccountStatus
);

export default router;
