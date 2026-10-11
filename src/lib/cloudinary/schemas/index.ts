import { z } from "zod";

// Image metadata validation schema
// Used for validating Cloudinary upload responses and product/banner image data
export const imageMetadataSchema = z.object({
  publicId: z.string().min(1).max(500),
  secureUrl: z.string().url(),
  altText: z.string().max(200).optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  format: z.string().max(50).optional(),
  bytes: z.number().int().positive().optional(),
});

// Partial schema for updates (altText can be updated independently)
export const altTextSchema = z.object({
  altText: z.string().max(200),
});

// Folder type schema
export const folderSchema = z.enum(["products", "banners", "general"]);

// Folder path generator
export function getFolderPath(folder: z.infer<typeof folderSchema>): string {
  const folders: Record<z.infer<typeof folderSchema>, string> = {
    products: "pureblend/products",
    banners: "pureblend/banners",
    general: "pureblend/general",
  };
  return folders[folder];
}

// Allowed MIME types
export const ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// Max file size: 5MB
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Cloudinary folder configuration
export const CLOUDINARY_CONFIG = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  apiKey: process.env.CLOUDINARY_API_KEY || "",
  apiSecret: process.env.CLOUDINARY_API_SECRET || "",
} as const;

// Cloudinary upload options schema
export const cloudinaryUploadSchema = z.object({
  folder: folderSchema,
  publicId: z.string().optional(),
  altText: z.string().max(200).optional(),
  format: z.string().max(50).optional(),
});

// Cloudinary delete options schema
export const cloudinaryDeleteSchema = z.object({
  publicId: z.string().min(1),
  cascade: z.boolean().default(false),
});

// Response validation schemas
export const uploadResponseSchema = z.object({
  success: z.boolean(),
  data: imageMetadataSchema.optional(),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }).optional(),
});

export type ImageMetadata = z.infer<typeof imageMetadataSchema>;
export type FolderType = z.infer<typeof folderSchema>;
export type CloudinaryUploadOptions = z.infer<typeof cloudinaryUploadSchema>;
export type CloudinaryDeleteOptions = z.infer<typeof cloudinaryDeleteSchema>;
export type UploadResponse = z.infer<typeof uploadResponseSchema>;