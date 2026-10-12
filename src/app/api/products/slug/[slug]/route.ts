import { NextResponse } from "next/server";
import { productService } from "@/lib/firestore/entities";
import { z } from "zod";

const productSlugSchema = z.string().min(1, "Product slug required");

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const validation = productSlugSchema.safeParse(slug);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: validation.error.issues[0]?.message ?? "Invalid product slug." } },
        { status: 400 }
      );
    }

    const product = await productService.getBySlug(slug);

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
    console.error("Product slug lookup error:", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err.message ?? "Failed to load product." } },
      { status: 500 }
    );
  }
}