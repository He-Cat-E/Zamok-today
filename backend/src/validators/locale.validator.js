import { z } from "zod";

export const localePreferenceUpsertSchema = z.object({
  deviceId: z.string().min(6).max(128),
  country: z.string().min(2).max(2),
  language: z.string().min(2).max(12),
  currency: z.string().min(3).max(3)
});
