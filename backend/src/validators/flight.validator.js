import { z } from "zod";

export const flightSearchSchema = z.object({
  from: z.string().min(2).max(10),
  to: z.string().min(2).max(10),
  departDate: z.string().min(8).max(10),
  returnDate: z.string().min(8).max(10).optional(),
  passengers: z.number().int().min(1).max(9),
  cabin: z.enum(["economy", "premium", "business", "first"])
});
