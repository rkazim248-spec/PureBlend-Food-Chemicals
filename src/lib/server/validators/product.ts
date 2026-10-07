import { z } from "zod";

export const specificationItemSchema = z.object({
  label: z.string().trim().min(1, "Specification label is required").max(100),
  value: z.string().trim().min(1, "Specification value is required").max(500),
});

export const productImageItemSchema = z.object({
  url: z.string().url("Image must be a valid URL"),
  alt: z.string().trim().min(1, "Image alt text is required").max(200),
});

export const createProductSchema = z.object({
  name: z.string().trim().min(2, "Product name must be at least 2 characters").max(150),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(150)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-safe (lowercase letters, numbers, and hyphens)"),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(10000),
  categoryId: z.string().min(1).nullable().optional(),
  specifications: z.array(specificationItemSchema).optional().default([]),
  images: z.array(productImageItemSchema).min(1, "At least one product image is required"),
  published: z.boolean().default(false),
  seo: z
    .object({
      metaTitle: z.string().trim().max(70).optional(),
      metaDescription: z.string().trim().max(160).optional(),
      ogImage: z.string().url().optional(),
    })
    .optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const publishProductSchema = z.object({
  published: z.boolean(),
});
