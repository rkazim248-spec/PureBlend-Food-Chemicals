import { NextResponse } from "next/server";
import { pageService } from "@/lib/firestore/entities";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const key = url.searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { success: false, error: { code: "PAGE_KEY_REQUIRED", message: "Page key is required." } },
        { status: 400 }
      );
    }

    const page = await pageService.getByKey(key);

    if (!page) {
      return NextResponse.json(
        { success: false, error: { code: "PAGE_NOT_FOUND", message: "Page not found." } },
        { status: 404 }
      );
    }

    // Only return published pages publicly
    if (!page.published) {
      return NextResponse.json(
        { success: false, error: { code: "PAGE_NOT_PUBLISHED", message: "Page is not published." } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: page,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Unexpected error" } },
      { status: 500 }
    );
  }
}