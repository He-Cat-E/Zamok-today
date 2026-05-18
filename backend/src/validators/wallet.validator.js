import { z } from "zod";
import { formatZodError } from "./auth.validator.js";

const cardDigits = (value) => String(value || "").replace(/\D/g, "");

function luhnCheck(num) {
  let sum = 0;
  let alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = Number(num[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

const cardNumberSchema = z
  .string()
  .trim()
  .min(1, "Card number is required")
  .refine((v) => {
    const digits = cardDigits(v);
    return digits.length >= 13 && digits.length <= 19;
  }, "Enter a valid card number")
  .refine((v) => luhnCheck(cardDigits(v)), "Card number is invalid");

const expirySchema = z
  .string()
  .trim()
  .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use MM/YY format")
  .refine((v) => {
    const [mm, yy] = v.split("/");
    const month = Number(mm);
    const year = 2000 + Number(yy);
    const now = new Date();
    const expEnd = new Date(year, month, 0, 23, 59, 59);
    return expEnd >= now;
  }, "Card has expired");

export const addFundsSchema = z.object({
  amount: z
    .number({ invalid_type_error: "Enter an amount" })
    .min(1, "Minimum top-up is 1")
    .max(50_000, "Maximum top-up is 50,000"),
  cardNumber: cardNumberSchema,
  expiry: expirySchema,
  cvc: z
    .string()
    .trim()
    .regex(/^\d{3,4}$/, "Enter a valid security code"),
  holderName: z.string().trim().min(2, "Cardholder name is required").max(80),
  billingAddress: z.object({
    line1: z.string().trim().min(3, "Address line is required").max(120),
    line2: z.string().trim().max(120).optional().or(z.literal("")),
    city: z.string().trim().min(2, "City is required").max(80),
    state: z.string().trim().max(80).optional().or(z.literal("")),
    postalCode: z.string().trim().min(2, "Postal code is required").max(20),
    country: z.string().trim().min(2, "Country is required").max(80)
  })
});

export { formatZodError, cardDigits };
