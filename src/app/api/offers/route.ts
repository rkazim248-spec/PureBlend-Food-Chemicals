import { NextResponse } from "next/server";
import { offerService } from "@/lib/firestore/entities";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const pageNum = page > 0 ? page : 1;
    const limitNum = limit > 0 ? limit : 10;

    const active = url.searchParams.get("active") === "true";
    const includeExpired = url.searchParams.get("includeExpired") === "true";

    const filters: Array<[string, string, unknown]> = [];

    if (active) {
      filters.push(["active", "==", true]);
    }

    // Always filter by valid date range for public offers
    const now = new Date();

    if (!includeExpired) {
      filters.push(["validTo", ">=", now]);
    }

    const result = await offerService.list(filters, limitNum, (pageNum - 1) * limitNum);

    // Count total with same filters
    const total = await offerService.count(filters);

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