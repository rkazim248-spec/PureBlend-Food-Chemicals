import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";
import { offerService } from "@/lib/firestore/entities";

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
    const offer = await offerService.getById(id);

    if (!offer) {
      return NextResponse.json(
        { success: false, error: { code: "OFFER_NOT_FOUND", message: "Offer not found." } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: offer,
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

    // Validate date range
    if (body.validTo && body.validFrom && new Date(body.validTo) <= new Date(body.validFrom)) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_OFFER_DATES", message: "endDate must be after startDate." } },
        { status: 400 }
      );
    }

    const offer = await offerService.create({
      ...body,
      active: body.active !== undefined ? body.active : false,
      validFrom: body.validFrom ? Timestamp.fromDate(new Date(body.validFrom)) : undefined,
      validTo: body.validTo ? Timestamp.fromDate(new Date(body.validTo)) : undefined,
    });

    return NextResponse.json({
      success: true,
      data: offer,
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

    // Validate date range if both dates are provided
    if (body.validTo && body.validFrom && new Date(body.validTo) <= new Date(body.validFrom)) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_OFFER_DATES", message: "endDate must be after startDate." } },
        { status: 400 }
      );
    }

    const offer = await offerService.update(id, {
      ...body,
      validFrom: body.validFrom ? Timestamp.fromDate(new Date(body.validFrom)) : undefined,
      validTo: body.validTo ? Timestamp.fromDate(new Date(body.validTo)) : undefined,
    });

    if (!offer) {
      return NextResponse.json(
        { success: false, error: { code: "OFFER_NOT_FOUND", message: "Offer not found." } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: offer,
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
    const deleted = await offerService.delete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: { code: "OFFER_NOT_FOUND", message: "Offer not found." } },
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