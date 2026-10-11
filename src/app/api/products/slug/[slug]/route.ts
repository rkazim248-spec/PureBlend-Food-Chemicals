import { NextResponse } from "next/server";
import { productService } from "@/lib/firestore/entities";
import { z } from "zod";

const productSlugSchema = z.string().min(1, "Product slug required");

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const validation = productSlugSchema.safeParse(params.slug);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: validation.error.errors[0].message } },
        { status: 400 }
      );
    }

    const product = await productService.getBySlug(params.slug);

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