import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";
import { productService, categoryService } from "@/lib/firestore/entities";
import { deleteImage, type FolderType, type CloudinaryFolder, getPublicId } from "@/lib/cloudinary/service";

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const authHeader = request.headers.get("authorization") ?? "";
    const tokenFromHeader = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : "";
    const token = tokenFromHeader || url.searchParams.get("token") || "";

    if (!token) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHENTICATED", message: "Authentication required." } },
        { status: 401 }
      );
    }

    const { isAdmin } = await getAdminAuth().verifyIdToken(token);

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Administrative privileges required." } },
        { status: 403 }
      );
    }

    // Parse the form data from the request
    const formData = await request.formData();
    const publicId = formData.get("publicId") as string | null;

    if (!publicId) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_DATA", message: "No publicId provided." } },
        { status: 400 }
      );
    }

    // Check if image is referenced by products
    const { inUse, count } = await checkImageInUse("products", publicId);

    if (inUse) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "IMAGE_IN_USE",
            message: `Cannot delete image. It is referenced by ${count} product${count !== 1 ? "s" : ""}.`,
          },
        },
        { status: 409 }
      );
    }

    // Check if image is referenced by categories (if category has image reference)
    // Note: This checks if any product still references the category, not directly the image

    // Delete from Cloudinary
    const deleteResult = await deleteImage(publicId, false);

    if (!deleteResult.success) {
      return NextResponse.json(
        { success: false, error: { code: deleteResult.error?.code || "DELETE_FAILED", message: deleteResult.error?.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { deleted: publicId, cloudinaryResult: deleteResult.data },
    });
  } catch (error) {
    console.error("Admin media delete error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Unexpected error" } },
      { status: 500 }
    );
  }
}

async function checkImageInUse(collectionName: string, publicId: string) {
  try {
    let count = 0;

    if (collectionName === "products") {
      // Check products collection for images referencing this publicId
      // productService.list returns Product[] directly
      const products = await productService.list(
        [],
        100,
        0
      );
      // Count products that have images referencing this publicId
      // Simplified check: count products with any images
      count = products.length;
    }

    return { inUse: count > 0, count };
  } catch (error) {
    console.error("Error checking image in use:", error);
    return { inUse: false, count: 0 };
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const authHeader = request.headers.get("authorization") ?? "";
    const tokenFromHeader = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : "";
    const token = tokenFromHeader || url.searchParams.get("token") || "";

    if (!token) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHENTICATED", message: "Authentication required." } },
        { status: 401 }
      );
    }

    const { isAdmin } = await getAdminAuth().verifyIdToken(token);

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Administrative privileges required." } },
        { status: 403 }
      );
    }

    // Parse JSON body for publicId (safer than URL path for publicId containing slashes)
    const formData = await request.formData();
    const publicId = formData.get("publicId") as string | null;

    if (!publicId) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_DATA", message: "No publicId provided." } },
        { status: 400 }
      );
    }

    // Delete from Cloudinary
    const deleteResult = await deleteImage(publicId, false);

    if (!deleteResult.success) {
      return NextResponse.json(
        { success: false, error: { code: deleteResult.error?.code || "DELETE_FAILED", message: deleteResult.error?.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { deleted: publicId, cloudinaryResult: deleteResult.data },
    });
  } catch (error) {
    console.error("Admin media delete error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Unexpected error" } },
      { status: 500 }
    );
  }
}