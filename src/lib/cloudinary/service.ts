import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { z } from "zod";

// Cloudinary configuration from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Allowed MIME types for image upload
export const ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// Allowed MIME types for any file
export const ALLOWED_MIME_TYPES = [...ALLOWED_IMAGE_MIME_TYPES, "application/pdf"];

// Max file size: 5MB
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Cloudinary folder structure
export const CLOUDINARY_FOLDERS = {
  products: "pureblend/products",
  banners: "pureblend/banners",
  general: "pureblend/general",
} as const;

export type CloudinaryFolder = keyof typeof CLOUDINARY_FOLDERS;

// Image metadata schema for validation
export const imageMetadataSchema = z.object({
  publicId: z.string().min(1).max(200),
  secureUrl: z.string().url(),
  altText: z.string().max(200).optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  format: z.string().max(50).optional(),
});

export type ImageMetadata = z.infer<typeof imageMetadataSchema>;

export const imageAltTextSchema = z.string().max(200).optional();

export const folderSchema = z.enum(["products", "banners", "general"]);

export type FolderType = z.infer<typeof folderSchema>;

export function getCloudinaryFolder(folder: FolderType): string {
  return CLOUDINARY_FOLDERS[folder];
}

export function isValidImageMimeType(mimeType: string): boolean {
  return ALLOWED_IMAGE_MIME_TYPES.includes(mimeType);
}

export function isValidFileSize(size: number): boolean {
  return size <= MAX_FILE_SIZE;
}

export function getPublicId(folder: FolderType, id: string): string {
  return `${getCloudinaryFolder(folder)}/${id}`;
}

export async function uploadImage(
  file: File | Buffer,
  folder: FolderType = "general",
  options?: { publicId?: string; altText?: string; format?: string }
): Promise<{
  success: boolean;
  data?: {
    publicId: string;
    secureUrl: string;
    width?: number;
    height?: number;
    format?: string;
    bytes: number;
  };
  error?: {
    code: string;
    message: string;
  };
}> {
  try {
    // Validate MIME type if it's a File object
    if (file instanceof File && !isValidImageMimeType(file.type)) {
      return {
        success: false,
        error: {
          code: "UNSUPPORTED_FILE_TYPE",
          message: `Unsupported file type: ${file.type}. Allowed types: ${ALLOWED_IMAGE_MIME_TYPES.join(
            ", "
          )}`,
        },
      };
    }

    // Validate file size
    const fileSize = file instanceof File ? file.size : Buffer.isBuffer(file) ? file.length : 0;
    if (!isValidFileSize(fileSize)) {
      return {
        success: false,
        error: {
          code: "FILE_TOO_LARGE",
          message: `File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
        },
      };
    }

    // Determine public ID
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const basePublicId = options?.publicId || `${timestamp}-${randomSuffix}`;
    const cloudinaryFolder = getCloudinaryFolder(folder);
    const publicId = `${cloudinaryFolder}/${basePublicId}`;

    // Upload to Cloudinary
    // For File objects from form Data, convert to Buffer
    const fileToUpload = file instanceof File ? Buffer.from(await file.arrayBuffer()) : file || "";
    const result = await cloudinary.uploader.upload(fileToUpload as any, {
      public_id: basePublicId,
      folder: cloudinaryFolder,
      format: options?.format,
      use_filename: true,
      unique_filename: false,
      timeout: 30000,
    });

    return {
      success: true,
      data: {
        publicId: result.public_id,
        secureUrl: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: Math.round(result.bytes || 0),
      },
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return {
      success: false,
      error: {
        code: "UPLOAD_FAILED",
        message: error instanceof Error ? error.message : "Unknown upload failure",
      },
    };
  }
}

export async function deleteImage(
  publicId: string,
  cascade: boolean = false
): Promise<{
  success: boolean;
  data?: {
    result: string;
  };
  error?: {
    code: string;
    message: string;
  };
}> {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      ...(cascade && { cascade: true }),
      timeout: 30000,
    } as any);

    return {
      success: true,
      data: { result: result.result },
    };
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return {
      success: false,
      error: {
        code: "DELETE_FAILED",
        message: error instanceof Error ? error.message : "Unknown deletion failure",
      },
    };
  }
}

export async function replaceImage(
  oldPublicId: string,
  newFile: File | Buffer,
  folder: FolderType = "general",
  options?: { publicId?: string; altText?: string; format?: string }
): Promise<{
  success: boolean;
  data?: {
    oldPublicId: string;
    newPublicId: string;
    newSecureUrl: string;
  };
  error?: {
    code: string;
    message: string;
  };
}> {
  try {
    // Delete old image first
    const deleteResult = await deleteImage(oldPublicId, false);

    if (!deleteResult.success) {
      return {
        success: false,
        error: {
          code: "DELETE_FAILED",
          message: "Failed to delete old image: " + deleteResult.error?.message,
        },
      };
    }

    // Upload new image
    const uploadResult = await uploadImage(newFile, folder, {
      publicId: options?.publicId,
      altText: options?.altText,
      format: options?.format,
    });

    if (!uploadResult.success) {
      // If upload fails, try to restore the old image - but since we can't,
      // at minimum log and return the error
      return {
        success: false,
        error: {
          code: "UPLOAD_FAILED",
          message: "New upload failed after old image was deleted",
        },
      };
    }

    return {
      success: true,
      data: {
        oldPublicId,
        newPublicId: uploadResult.data!.publicId,
        newSecureUrl: uploadResult.data!.secureUrl,
      },
    };
  } catch (error) {
    console.error("Cloudinary replace error:", error);
    return {
      success: false,
      error: {
        code: "REPLACE_FAILED",
        message: error instanceof Error ? error.message : "Unknown replacement failure",
      },
    };
  }
}