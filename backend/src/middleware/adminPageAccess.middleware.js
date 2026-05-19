import { adminHasPageKey, adminCanManageAdmins } from "../config/adminPages.js";

export function requireAdminPage(pageKey) {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (adminHasPageKey(req.admin, pageKey)) {
      return next();
    }
    return res.status(403).json({
      error: "You do not have access to this section",
      code: "ADMIN_FORBIDDEN"
    });
  };
}

export function requireAdminManagement(req, res, next) {
  if (!req.admin) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (adminCanManageAdmins(req.admin)) {
    return next();
  }
  return res.status(403).json({
    error: "You do not have permission to manage administrators",
    code: "ADMIN_FORBIDDEN"
  });
}
