import { NextResponse } from "next/server";
import { categoryService } from "@/lib/firestore/entities";
import { z } from "zod";

const categoryIdSchema = z.string().min(1, "Category ID required");

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const validation = categoryIdSchema.safeParse(id);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: validation.error.issues[0]?.message ?? "Invalid category ID." } },
        { status: 400 }
      );
    }

    const category = await categoryService.getById(id);

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
    console.error("Category detail error:", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err.message ?? "Failed to load category." } },
      { status: 500 }
    );
  }
}