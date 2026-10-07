import { z } from "zod";

export const createOfferSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters").max(150),
  description: z.string().trim().max(1000).optional(),
  discountText: z.string().trim().min(1, "Discount text is required").max(100),
  validFrom: z.string().datetime().optional().nullable(),
  validTo: z.string().datetime().optional().nullable(),
  active: z.boolean().default(true),
  imageUrl: z.string().url().optional().nullable(),
});

export const updateOfferSchema = createOfferSchema.partial();
