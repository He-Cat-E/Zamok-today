import mongoose from "mongoose";
import { sanitizeAdminPermissions } from "../config/adminPages.js";

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true
    },
    passwordHash: { type: String, required: true, select: false },
    fullName: { type: String, default: "Super Admin", trim: true, maxlength: 80 },
    role: { type: String, enum: ["super_admin", "admin"], default: "super_admin" },
    accountStatus: {
      type: String,
      enum: ["active", "suspended"],
      default: "active"
    },
    suspendedAt: { type: Date, default: null },
    permissions: {
      type: [String],
      default: () => ["dashboard"]
    }
  },
  { timestamps: true }
);

adminSchema.methods.getPageKeys = function getPageKeys() {
  if (this.role === "super_admin") {
    return sanitizeAdminPermissions(["dashboard", "users", "admins", "transactions"]);
  }
  return sanitizeAdminPermissions(this.permissions);
};

adminSchema.methods.toPublicJSON = function toPublicJSON() {
  const pageKeys = this.getPageKeys();
  return {
    id: String(this._id),
    email: this.email,
    fullName: String(this.fullName || "Admin").trim(),
    role: this.role,
    accountStatus: this.accountStatus === "suspended" ? "suspended" : "active",
    permissions: pageKeys,
    canManageAdmins: this.role === "super_admin" || pageKeys.includes("admins")
  };
};

if (mongoose.models.Admin) {
  mongoose.deleteModel("Admin");
}

export const Admin = mongoose.model("Admin", adminSchema);
