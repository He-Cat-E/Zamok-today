import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { Admin } from "../models/Admin.js";
import { parseDataTablesRequest } from "../utils/dataTablesRequest.js";
import {
  createAdminSchema,
  updateAdminPermissionsSchema,
  updateAdminStatusSchema,
  formatZodError
} from "../validators/admin.validator.js";
import {
  isSuperAdmin,
  sanitizeAdminPermissions
} from "../config/adminPages.js";

const BCRYPT_ROUNDS = 12;

const SORTABLE_FIELDS = new Set(["fullName", "email", "role", "accountStatus", "createdAt"]);

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function adminToRow(doc, currentAdminId) {
  const pageKeys =
    doc.role === "super_admin"
      ? sanitizeAdminPermissions(["dashboard", "users", "admins", "transactions"])
      : sanitizeAdminPermissions(doc.permissions);

  return {
    id: String(doc._id),
    fullName: String(doc.fullName || "").trim(),
    email: String(doc.email || "").trim(),
    role: doc.role === "super_admin" ? "super_admin" : "admin",
    accountStatus: doc.accountStatus === "suspended" ? "suspended" : "active",
    permissions: pageKeys,
    permissionsCount: pageKeys.length,
    isSuperAdmin: doc.role === "super_admin",
    isSelf: String(doc._id) === String(currentAdminId),
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : "",
    createdAtDisplay: doc.createdAt
      ? new Date(doc.createdAt).toLocaleString("en-GB", {
          dateStyle: "medium",
          timeStyle: "short"
        })
      : ""
  };
}

function assertCanManageTarget(actor, target) {
  if (!target) {
    const err = new Error("Administrator not found");
    err.status = 404;
    throw err;
  }
  if (String(target._id) === String(actor._id)) {
    const err = new Error("You cannot modify your own account here");
    err.status = 400;
    throw err;
  }
  if (target.role === "super_admin" && !isSuperAdmin(actor)) {
    const err = new Error("Only a super admin can manage super admin accounts");
    err.status = 403;
    throw err;
  }
}

export async function listAdminsDataTable(req, res) {
  try {
    const { draw, start, length, searchValue, orderDir, columnData } =
      parseDataTablesRequest(req);

    const sortField = SORTABLE_FIELDS.has(columnData) ? columnData : "createdAt";
    const mongoSortDir = orderDir === "asc" ? 1 : -1;

    const filter = {};
    if (searchValue) {
      const re = new RegExp(escapeRegex(searchValue), "i");
      filter.$or = [{ fullName: re }, { email: re }, { role: re }];
    }

    const recordsTotal = await Admin.countDocuments();
    const recordsFiltered = searchValue ? await Admin.countDocuments(filter) : recordsTotal;

    const docs = await Admin.find(filter)
      .sort({ [sortField]: mongoSortDir })
      .skip(start)
      .limit(length)
      .lean();

    return res.json({
      draw,
      recordsTotal,
      recordsFiltered,
      data: docs.map((doc) => adminToRow(doc, req.adminId))
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[admin] list admins:", err?.message || err);
    return res.status(500).json({ error: "Could not load administrators" });
  }
}

export async function createAdminAccount(req, res) {
  try {
    const parsed = createAdminSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: formatZodError(parsed.error) });
    }

    const { fullName, email, password, permissions } = parsed.data;
    const emailNorm = email.trim().toLowerCase();
    const pageKeys = sanitizeAdminPermissions(permissions);

    const existing = await Admin.findOne({ email: emailNorm });
    if (existing) {
      return res.status(409).json({ error: "An administrator with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const admin = await Admin.create({
      fullName: fullName.trim(),
      email: emailNorm,
      passwordHash,
      role: "admin",
      accountStatus: "active",
      permissions: pageKeys
    });

    return res.status(201).json({ admin: adminToRow(admin, req.adminId) });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[admin] create admin:", err?.message || err);
    return res.status(500).json({ error: "Could not create administrator" });
  }
}

export async function updateAdminAccount(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid administrator id" });
    }

    const parsed = updateAdminPermissionsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: formatZodError(parsed.error) });
    }

    const target = await Admin.findById(id);
    assertCanManageTarget(req.admin, target);

    if (target.role === "super_admin") {
      return res.status(400).json({ error: "Super admin permissions cannot be changed" });
    }

    if (parsed.data.fullName) {
      target.fullName = parsed.data.fullName.trim();
    }
    target.permissions = sanitizeAdminPermissions(parsed.data.permissions);
    await target.save();

    return res.json({ admin: adminToRow(target, req.adminId) });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({
      error: err.message || "Could not update administrator"
    });
  }
}

export async function updateAdminAccountStatus(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid administrator id" });
    }

    const parsed = updateAdminStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: formatZodError(parsed.error) });
    }

    const target = await Admin.findById(id);
    assertCanManageTarget(req.admin, target);

    if (target.role === "super_admin") {
      return res.status(400).json({ error: "Super admin accounts cannot be suspended" });
    }

    const status = parsed.data.status;
    target.accountStatus = status;
    target.suspendedAt = status === "suspended" ? new Date() : null;
    await target.save();

    return res.json({ admin: adminToRow(target, req.adminId) });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({
      error: err.message || "Could not update administrator status"
    });
  }
}

export async function listAdminPages(_req, res) {
  return res.json({
    pages: [
      { key: "dashboard", path: "/dashboard" },
      { key: "users", path: "/users" },
      { key: "admins", path: "/admins" },
      { key: "transactions", path: "/transactions" }
    ]
  });
}
