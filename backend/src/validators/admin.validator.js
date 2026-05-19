import { z } from "zod";

const emailSchema = z.string().trim().email("Enter a valid email address").max(254);

export const adminLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password"),
  rememberMe: z.boolean().optional()
});

export function formatZodError(error) {
  const first = error.errors[0];
  if (!first) return "Invalid input";
  const path = first.path.length ? `${first.path.join(".")}: ` : "";
  return `${path}${first.message}`;
}

export const createAdminSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(80),
  email: emailSchema,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long"),
  permissions: z.array(z.string()).min(1, "Select at least one page")
});

export const updateAdminPermissionsSchema = z.object({
  fullName: z.string().trim().min(2).max(80).optional(),
  permissions: z.array(z.string()).min(1, "Select at least one page")
});

export const updateAdminStatusSchema = z.object({
  status: z.enum(["active", "suspended"])
});

export const updateAdminProfileSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(80)
});

export const changeAdminPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long"),
    confirmPassword: z.string().min(1, "Confirm your new password")
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });
