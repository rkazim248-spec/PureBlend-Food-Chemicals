import { NextResponse } from "next/server";
import { categoryService } from "@/lib/firestore/entities";
import { z } from "zod";

const categorySlugSchema = z.string().min(1, "Category slug required");

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const validation = categorySlugSchema.safeParse(params.slug);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: validation.error.errors[0].message } },
        { status: 400 }
      );
    }

    const category = await categoryService.getBySlug(params.slug);

    if (!category) {
      return NextResponse.json(
        { success: false, error: { code: "CATEGORY_NOT_FOUND", message: "Category not found." } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (err: any) {
    console.error("Category slug lookup error:", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err.message ?? "Failed to load category." } },
      { status: 500 }
    );
  }
}