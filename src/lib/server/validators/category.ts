import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().trim().min(2, "Category name must be at least 2 characters").max(100),
  slug: z
    .string()
    .trim()
    .min(2, "Category slug must be at least 2 characters")
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-safe (lowercase letters, numbers, and hyphens)"),
  description: z.string().trim().max(500).optional(),
  displayOrder: z.number().int().default(0).optional(),
});

export const updateCategorySchema = createCategorySchema.partial();
