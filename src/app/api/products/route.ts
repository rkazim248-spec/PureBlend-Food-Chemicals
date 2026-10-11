import { NextResponse } from "next/server";
import { productService } from "@/lib/firestore/entities";

export async function GET(request: Request) {
  try {
    // Simple query param parsing
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "12");
    const category = url.searchParams.get("category");
    const search = url.searchParams.get("search");
    const featured = url.searchParams.get("featured");

    const pageNum = page > 0 ? page : 1;
    const limitNum = limit > 0 ? limit : 12;
    const limitMax = 50;

    // Build Firestore filters
    const filters: Array<[string, string, unknown]> = [];

    // Always filter to published products for public API
    filters.push(["published", "==", true]);

    if (category) {
      filters.push(["categoryId", "==", category]);
    }

    if (featured !== null && featured !== undefined) {
      filters.push(["featured", "==", featured === "true"]);
    }

    if (search) {
      filters.push(["name", ">=", search]);
    }

    // Fetch paginated products
    const result = await productService.getPaginated(
      pageNum,
      limitNum,
      filters as Array<[string, string, unknown]>
    );

    return NextResponse.json({
      success: true,
      data: {
        items: result.items,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Unexpected error" } },
      { status: 500 }
    );
  }
}