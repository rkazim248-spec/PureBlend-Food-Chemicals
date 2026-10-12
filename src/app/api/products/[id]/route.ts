import { NextResponse } from "next/server";
import { productService } from "@/lib/firestore/entities";
import { z } from "zod";

const productIdSchema = z.string().min(1, "Product ID required");

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const validation = productIdSchema.safeParse(id);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: validation.error.issues[0]?.message ?? "Invalid product ID." } },
        { status: 400 }
      );
    }

    const product = await productService.getById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: { code: "PRODUCT_NOT_FOUND", message: "Product not found." } },
        { status: 404 }
      );
    }

    // For public API, only return published products
    if (!product.published) {
      return NextResponse.json(
        { success: false, error: { code: "PRODUCT_NOT_FOUND", message: "Product not found." } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (err: any) {
    console.error("Product detail error:", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err.message ?? "Failed to load product." } },
      { status: 500 }
    );
  }
}