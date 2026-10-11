import { NextResponse } from "next/server";
import { categoryService } from "@/lib/firestore/entities";

export async function GET(request: Request) {
  try {
    // Simple query param parsing without Zod complex types
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const published = url.searchParams.get("published") === "true";

    // Validation
    const pageNum = page > 0 ? page : 1;
    const limitNum = limit > 0 ? limit : 20;
    const limitMax = 100;
    const publishedBool = published;

    const filters: Array<[string, string, unknown]> = [];

    if (publishedBool !== undefined) {
      filters.push(["published", "==", publishedBool]);
    }

    // Use list with manual pagination
    const items = await categoryService.list(
      filters,
      limitNum,
      (pageNum - 1) * limitNum
    );

    // Count total manually
    const total = await categoryService.count(filters as Array<[string, string, unknown]>);

    // Calculate total pages
    const totalPages = Math.ceil(total / limitNum);

    return NextResponse.json({
      success: true,
      data: {
        items,
        total,
        page: pageNum,
        totalPages,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Unexpected error" } },
      { status: 500 }
    );
  }
}