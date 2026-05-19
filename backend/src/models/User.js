import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80
    },
    username: { type: String },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true
    },
    passwordHash: { type: String, required: true, select: false },
    avatarUrl: { type: String, default: "" },
    nationalId: { type: String, default: "", trim: true, maxlength: 11 },
    dateOfBirth: { type: String, default: "", trim: true, maxlength: 10 },
    emailVerified: { type: Boolean, default: true },
    emailVerificationTokenHash: { type: String, default: null, select: false },
    emailVerificationExpires: { type: Date, default: null, select: false },
    resetPasswordTokenHash: { type: String, default: null, select: false },
    resetPasswordExpires: { type: Date, default: null, select: false }
  },
  { timestamps: true }
);

userSchema.methods.getFullName = function getFullName() {
  const name = String(this.fullName || "").trim();
  if (name) return name;
  return String(this.username || "").trim();
};

userSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: String(this._id),
    fullName: this.getFullName(),
    email: this.email,
    avatarUrl: this.avatarUrl || "",
    nationalId: this.nationalId || "",
    dateOfBirth: this.dateOfBirth || "",
    emailVerified: this.emailVerified ?? true
  };
};

if (mongoose.models.User) {
  mongoose.deleteModel("User");
}

export const User = mongoose.model("User", userSchema);
