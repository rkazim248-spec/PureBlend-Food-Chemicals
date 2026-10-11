import { NextResponse } from "next/server";
import { bannerService } from "@/lib/firestore/entities";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const pageNum = page > 0 ? page : 1;
    const limitNum = limit > 0 ? limit : 10;

    const active = url.searchParams.get("active") === "true";

    const filters: Array<[string, string, unknown]> = [];

    if (active) {
      filters.push(["active", "==", true]);
    }

    const result = await bannerService.getActive();

    return NextResponse.json({
      success: true,
      data: {
        items: result,
        total: result.length,
        page: pageNum,
        totalPages: 1,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Unexpected error" } },
      { status: 500 }
    );
  }
}