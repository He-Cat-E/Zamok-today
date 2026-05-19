import mongoose from "mongoose";

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
    role: { type: String, enum: ["super_admin", "admin"], default: "super_admin" }
  },
  { timestamps: true }
);

adminSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: String(this._id),
    email: this.email,
    fullName: String(this.fullName || "Admin").trim(),
    role: this.role
  };
};

if (mongoose.models.Admin) {
  mongoose.deleteModel("Admin");
}

export const Admin = mongoose.model("Admin", adminSchema);
