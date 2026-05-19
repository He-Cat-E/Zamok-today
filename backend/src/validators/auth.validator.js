import { z } from "zod";

const fullNameSchema = z
  .string()
  .trim()
  .min(2, "Full name must be at least 2 characters")
  .max(80, "Full name must be at most 80 characters");

const emailSchema = z.string().trim().email("Enter a valid email address").max(254);

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password is too long");

export const registerSchema = z
  .object({
    fullName: z.string().trim().optional(),
    username: z.string().trim().optional(),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string()
  })
  .transform((data) => {
    const fullName = String(data.fullName || data.username || "")
      .trim()
      .replace(/\s+/g, " ");
    return { ...data, fullName };
  })
  .pipe(
    z
      .object({
        fullName: fullNameSchema,
        email: emailSchema,
        password: passwordSchema,
        confirmPassword: z.string()
      })
      .refine((d) => d.password === d.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"]
      })
  );

export const loginSchema = z.object({
  identifier: emailSchema,
  password: z.string().min(1, "Enter your password"),
  rememberMe: z.boolean().optional()
});

const nationalIdSchema = z
  .string()
  .trim()
  .regex(/^[1-9]\d{10}$/, "Enter a valid 11-digit national ID")
  .optional()
  .or(z.literal(""));

const dateOfBirthSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format")
  .optional()
  .or(z.literal(""));

export const updateProfileSchema = z.object({
  fullName: fullNameSchema,
  nationalId: nationalIdSchema,
  dateOfBirth: dateOfBirthSchema
});

export const forgotPasswordSchema = z.object({
  email: emailSchema
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required")
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: passwordSchema,
    confirmPassword: z.string()
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

const FIELD_LABELS = {
  fullName: "Full name",
  email: "Email",
  password: "Password",
  confirmPassword: "Confirm password",
  identifier: "Email",
  token: "Token",
  nationalId: "National ID",
  dateOfBirth: "Date of birth"
};

export function formatZodError(err) {
  const first = err.errors?.[0];
  if (!first) return "Invalid request";

  const field = first.path?.[0];
  const label = field && FIELD_LABELS[field] ? FIELD_LABELS[field] : null;

  if (first.code === "invalid_type" && (first.received === "undefined" || first.received === "null")) {
    return label ? `${label} is required` : "Please fill in all required fields";
  }

  return first.message || "Invalid request";
}
