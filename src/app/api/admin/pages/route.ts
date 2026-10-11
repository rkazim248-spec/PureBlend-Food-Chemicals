import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";
import { pageService } from "@/lib/firestore/entities";

export async function GET(request: Request, { params }: { params: { id: string } }) {
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
    const page = await pageService.getById(id);

    if (!page) {
      return NextResponse.json(
        { success: false, error: { code: "PAGE_NOT_FOUND", message: "Page not found." } },
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

export async function POST(request: Request, { params }: { params: {} }) {
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

    // Validate key is provided and unique
    if (!body.key) {
      return NextResponse.json(
        { success: false, error: { code: "PAGE_KEY_REQUIRED", message: "Page key is required." } },
        { status: 400 }
      );
    }

// Validate key is provided
    if (!body.key) {
      return NextResponse.json(
        { success: false, error: { code: "PAGE_KEY_REQUIRED", message: "Page key is required." } },
        { status: 400 }
      );
    }

    const page = await pageService.create({
      ...body,
      pageKey: body.key,
      published: body.published ?? false,
    });

    return NextResponse.json({
      success: true,
      data: page,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Unexpected error" } },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
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

    // If key is being updated, check for uniqueness
    if (body.key && body.key !== (await pageService.getById(id))?.pageKey) {
      const existingKey = await pageService.getByKey(body.key);
      if (existingKey) {
        return NextResponse.json(
          { success: false, error: { code: "DUPLICATE_PAGE_KEY", message: "A page with this key already exists." } },
          { status: 409 }
        );
      }
    }

    const updated = await pageService.update(id, {
      ...body,
      pageKey: body.key,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: { code: "PAGE_NOT_FOUND", message: "Page not found." } },
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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
    const deleted = await pageService.delete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: { code: "PAGE_NOT_FOUND", message: "Page not found." } },
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