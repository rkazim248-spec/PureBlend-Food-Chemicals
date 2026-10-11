import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";
import { categoryService } from "@/lib/firestore/entities";
import { productService } from "@/lib/firestore/entities";

export async function GET(request: Request, { params }: { params: { id: string } }) {
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

    const slugExists = await categoryService.slugExists(body.slug);

    if (slugExists) {
      return NextResponse.json(
        { success: false, error: { code: "DUPLICATE_CATEGORY_SLUG", message: "A category with this slug already exists." } },
        { status: 409 }
      );
    }

    const category = await categoryService.create({
      ...body,
    });

    return NextResponse.json({
      success: true,
      data: category,
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

    const slugExists = await categoryService.slugExists(body.slug, id);

    if (slugExists) {
      return NextResponse.json(
        { success: false, error: { code: "DUPLICATE_CATEGORY_SLUG", message: "A category with this slug already exists." } },
        { status: 409 }
      );
    }

    const updated = await categoryService.update(id, {
      ...body,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: { code: "CATEGORY_NOT_FOUND", message: "Category not found." } },
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

    const { inUse, count } = await checkCategoryInUse(id);

    if (inUse) {
      return NextResponse.json(
        { success: false, error: { code: "CATEGORY_IN_USE", message: `Cannot delete a category that contains ${count} product${count !== 1 ? "s" : ""}.` } },
        { status: 409 }
      );
    }

    const deleted = await categoryService.delete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: { code: "CATEGORY_NOT_FOUND", message: "Category not found." } },
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

async function checkCategoryInUse(categoryId: string) {
  try {
    const count = await productService.count([
      ["categoryId", "==", categoryId],
    ]);
    return { inUse: count > 0, count };
  } catch (error) {
    return { inUse: false, count: 0 };
  }
}