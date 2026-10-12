import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";
import { bannerService } from "@/lib/firestore/entities";
import { batchWrite } from "@/lib/firestore/service";

export async function GET(request: Request, { params }: { params: Promise<Record<string, string>> }) {
  try {
    const url = new URL(request.url);
    const authHeader = request.headers.get("authorization") ?? "";
    const tokenFromHeader = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : "";
    const token = tokenFromHeader || url.searchParams.get("token") || "";

    if (!token) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHENTICATED", message: "Authentication required." } },
        { status: 401 }
      );
    }

    const { isAdmin } = await getAdminAuth().verifyIdToken(token);

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Administrative privileges required." } },
        { status: 403 }
      );
    }

    const { id } = await params;
    const banner = await bannerService.getById(id);

    if (!banner) {
      return NextResponse.json(
        { success: false, error: { code: "BANNER_NOT_FOUND", message: "Banner not found." } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: banner,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Unexpected error" } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, { params }: { params: Promise<Record<string, string>> }) {
  try {
    const body: any = await request.json();

    const { isAdmin } = await getAdminAuth().verifyIdToken(
      request.headers.get("authorization")?.replace("Bearer ", "") || ""
    );

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Administrative privileges required." } },
        { status: 403 }
      );
    }

    const banner = await bannerService.create({
      ...body,
      active: body.active !== undefined ? body.active : true,
      displayOrder: body.displayOrder ?? 0,
    });

    return NextResponse.json({
      success: true,
      data: banner,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Unexpected error" } },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<Record<string, string>> }) {
  try {
    const { id } = await params;

    const { isAdmin } = await getAdminAuth().verifyIdToken(
      request.headers.get("authorization")?.replace("Bearer ", "") || ""
    );

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Administrative privileges required." } },
        { status: 403 }
      );
    }

    const body: any = await request.json();

    const updated = await bannerService.update(id, {
      ...body,
      displayOrder: body.displayOrder,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: { code: "BANNER_NOT_FOUND", message: "Banner not found." } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Unexpected error" } },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<Record<string, string>> }) {
  try {
    const url = new URL(request.url);
    const authHeader = request.headers.get("authorization") ?? "";
    const tokenFromHeader = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : "";
    const token = tokenFromHeader || url.searchParams.get("token") || "";

    if (!token) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHENTICATED", message: "Authentication required." } },
        { status: 401 }
      );
    }

    const { isAdmin } = await getAdminAuth().verifyIdToken(token);

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Administrative privileges required." } },
        { status: 403 }
      );
    }

    const { id } = await params;
    const deleted = await bannerService.delete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: { code: "BANNER_NOT_FOUND", message: "Banner not found." } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Unexpected error" } },
      { status: 500 }
    );
  }
}

export async function PATCH_reorder(request: Request) {
  try {
    const body: any = await request.json();
    const { items } = body;

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_DATA", message: "Items array is required." } },
        { status: 400 }
      );
    }

    const { isAdmin } = await getAdminAuth().verifyIdToken(
      request.headers.get("authorization")?.replace("Bearer ", "") || ""
    );

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Administrative privileges required." } },
        { status: 403 }
      );
    }

    const operations = items.map((item: any, index: number) => ({
      type: "update" as const,
      collection: "banners",
      id: item.id,
      data: { displayOrder: index },
    }));

    const { batchWrite } = (await import("@/lib/firestore/service"));
    await batchWrite(operations);

    return NextResponse.json({
      success: true,
      data: { reordered: items.length },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Unexpected error" } },
      { status: 500 }
    );
  }
}