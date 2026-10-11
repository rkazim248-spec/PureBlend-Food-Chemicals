import { NextResponse } from "next/server";
import { faqService } from "@/lib/firestore/entities";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const pageNum = page > 0 ? page : 1;
    const limitNum = limit > 0 ? limit : 10;

    const published = url.searchParams.get("published") === "true";

    const filters: Array<[string, string, unknown]> = [];

    if (published) {
      filters.push(["published", "==", true]);
    }

    const result = await faqService.list(filters, limitNum, (pageNum - 1) * limitNum);

    // Count total with same filters
    const total = await faqService.count(filters);

    return NextResponse.json({
      success: true,
      data: {
        items: result,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Unexpected error" } },
      { status: 500 }
    );
  }
}