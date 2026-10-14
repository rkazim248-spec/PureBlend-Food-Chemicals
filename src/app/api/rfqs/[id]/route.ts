import { NextResponse } from "next/server";
import { z } from "zod";
import { quotationRequestService } from "@/lib/firestore/entities";
import { requireRfqAdmin } from "@/lib/server/rfq-auth";

const statusSchema = z.object({
  status: z.enum(["Pending Review", "Technical Review", "Quote Issued", "Contract Drafted"]),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireRfqAdmin(request);
  if (authError) return authError;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid request body." } },
      { status: 400 }
    );
  }

  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid quotation request status." } },
      { status: 400 }
    );
  }

  const { id } = await params;
  try {
    const updated = await quotationRequestService.updateStatus(id, parsed.data.status);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: { code: "RFQ_NOT_FOUND", message: "Quotation request not found." } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id: updated.id, status: updated.status },
    });
  } catch (error) {
    console.error("Failed to update quotation request status:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Unable to update quotation request status." } },
      { status: 500 }
    );
  }
}
