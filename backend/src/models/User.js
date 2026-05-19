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
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    authMethod: {
      type: String,
      enum: ["email", "phone"],
      default: "email"
    },
    passwordHash: { type: String, select: false, default: null },
    avatarUrl: { type: String, default: "" },
    nationalId: { type: String, default: "", trim: true, maxlength: 11 },
    dateOfBirth: { type: String, default: "", trim: true, maxlength: 10 },
    emailVerified: { type: Boolean, default: true },
    phoneVerified: { type: Boolean, default: false },
    emailVerificationTokenHash: { type: String, default: null, select: false },
    emailVerificationExpires: { type: Date, default: null, select: false },
    resetPasswordTokenHash: { type: String, default: null, select: false },
    resetPasswordExpires: { type: Date, default: null, select: false },
    accountStatus: {
      type: String,
      enum: ["active", "suspended"],
      default: "active"
    },
    suspendedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

userSchema.index(
  { email: 1 },
  {
    unique: true,
    name: "user_email_unique_nonempty",
    partialFilterExpression: { email: { $type: "string", $gt: "" } }
  }
);

userSchema.index(
  { phone: 1 },
  {
    unique: true,
    name: "user_phone_unique_nonempty",
    partialFilterExpression: { phone: { $type: "string", $gt: "" } }
  }
);

userSchema.pre("validate", function preValidateUser() {
  const hasEmail = Boolean(String(this.email || "").trim());
  const hasPhone = Boolean(String(this.phone || "").trim());

  if (!hasEmail && !hasPhone) {
    this.invalidate("email", "Email or phone is required");
  }
  if (this.authMethod === "email" && !hasEmail) {
    this.invalidate("email", "Email is required");
  }
  if (this.authMethod === "phone" && !hasPhone) {
    this.invalidate("phone", "Phone is required");
  }
  if (this.isNew && this.authMethod === "email" && !this.passwordHash) {
    this.invalidate("passwordHash", "Password is required");
  }
});

userSchema.methods.getFullName = function getFullName() {
  const name = String(this.fullName || "").trim();
  if (name) return name;
  return String(this.username || "").trim();
};

userSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: String(this._id),
    fullName: this.getFullName(),
    email: this.email || "",
    phone: this.phone || "",
    authMethod: this.authMethod || "email",
    avatarUrl: this.avatarUrl || "",
    nationalId: this.nationalId || "",
    dateOfBirth: this.dateOfBirth || "",
    emailVerified: this.emailVerified ?? true,
    phoneVerified: this.phoneVerified ?? false
  };
};

if (mongoose.models.User) {
  mongoose.deleteModel("User");
}

export const User = mongoose.model("User", userSchema);
