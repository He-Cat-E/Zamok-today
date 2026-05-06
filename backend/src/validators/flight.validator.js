import { z } from "zod";

export const flightSearchSchema = z.object({
  from: z.string().min(2).max(64),
  to: z.string().min(2).max(64),
  departDate: z.string().min(8).max(10).optional(),
  returnDate: z.string().min(8).max(10).optional(),
  passengers: z.number().int().min(1).max(9),
  cabin: z.enum(["economy", "premium", "business", "first"])
});
