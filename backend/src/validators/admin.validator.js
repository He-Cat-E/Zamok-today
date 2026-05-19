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
