import { NextResponse } from "next/server";
import { categoryService } from "@/lib/firestore/entities";
import { z } from "zod";

const categorySlugSchema = z.string().min(1, "Category slug required");

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const validation = categorySlugSchema.safeParse(slug);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: validation.error.issues[0]?.message ?? "Invalid category slug." } },
        { status: 400 }
      );
    }

    const category = await categoryService.getBySlug(slug);

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