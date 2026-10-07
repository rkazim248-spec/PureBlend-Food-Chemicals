import { z } from "zod";

export const createBannerSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters").max(150),
  description: z.string().trim().max(500).optional(),
  imageUrl: z.string().url("Banner image must be a valid URL"),
  imageAlt: z.string().trim().min(1, "Image alt text is required").max(200),
  linkUrl: z.string().trim().max(255).optional(),
  linkLabel: z.string().trim().max(100).optional(),
  order: z.number().int().default(0),
  active: z.boolean().default(true),
});

export const updateBannerSchema = createBannerSchema.partial();
