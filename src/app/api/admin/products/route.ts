import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";
import { productService } from "@/lib/firestore/entities";

export async function GET(request: Request, { params }: { params: Promise<Record<string, string>> }) {
  try {
    const { searchParams } = new URL(request.url);
    const authHeader = request.headers.get("authorization") ?? "";
    const tokenFromHeader = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : "";
    const token = tokenFromHeader || searchParams.get("token") || "";

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
    const product = await productService.getById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: { code: "PRODUCT_NOT_FOUND", message: "Product not found." } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
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

    const slugExists = await productService.slugExists(body.slug);

    if (slugExists) {
      return NextResponse.json(
        { success: false, error: { code: "DUPLICATE_PRODUCT_SLUG", message: "A product with this slug already exists." } },
        { status: 409 }
      );
    }

    const product = await productService.create({
      ...body,
    });

    return NextResponse.json({
      success: true,
      data: product,
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

    if (body.slug) {
      const slugExists = await productService.slugExists(body.slug, id);

      if (slugExists) {
        return NextResponse.json(
          { success: false, error: { code: "DUPLICATE_PRODUCT_SLUG", message: "A product with this slug already exists." } },
          { status: 409 }
        );
      }
    }

    const updated = await productService.update(id, {
      ...body,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: { code: "PRODUCT_NOT_FOUND", message: "Product not found." } },
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
    const { searchParams } = new URL(request.url);
    const authHeader = request.headers.get("authorization") ?? "";
    const tokenFromHeader = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : "";
    const token = tokenFromHeader || searchParams.get("token") || "";

    const { isAdmin } = await getAdminAuth().verifyIdToken(token);

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Administrative privileges required." } },
        { status: 403 }
      );
    }

    const { id } = await params;

    const deleted = await productService.delete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: { code: "PRODUCT_NOT_FOUND", message: "Product not found." } },
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