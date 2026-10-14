import { NextResponse } from "next/server";
import { z } from "zod";
import { PRODUCTS_DATA } from "@/data/mockData";
import { quotationRequestService } from "@/lib/firestore/entities";
import { checkRateLimit, getClientIp } from "@/lib/server/rate-limit";
import { requireRfqAdmin } from "@/lib/server/rfq-auth";

const submissionSchema = z.object({
  companyName: z.string().trim().min(1).max(200),
  contactName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(50).optional(),
  productId: z.string().trim().min(1).max(120),
  volume: z.string().trim().regex(/^\d{1,9}(?:\.\d{1,3})?$/).refine((value) => Number(value) > 0),
  volumeUnit: z.enum(["kg", "Metric Tons (MT)", "Pallets", "FCL (20ft Container)"]),
  packaging: z.string().trim().min(1).max(120),
  targetDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
  deliveryLocation: z.string().trim().min(1).max(200),
  incoterm: z.enum(["FOB", "CIF", "DDP", "EXW"]),
  notes: z.string().trim().max(2000).optional(),
});

export async function POST(request: Request) {
  const limit = checkRateLimit(`rfq:${getClientIp(request)}`, { windowMs: 10 * 60 * 1000, maxRequests: 5 });
  if (!limit.success) {
    return NextResponse.json(
      { success: false, error: { code: "RATE_LIMITED", message: "Too many quotation requests. Please try again later." } },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid request body." } },
      { status: 400 }
    );
  }

  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Invalid quotation request." } },
      { status: 400 }
    );
  }

  const product = PRODUCTS_DATA.find((item) => item.id === parsed.data.productId);
  if (!product) {
    return NextResponse.json(
      { success: false, error: { code: "PRODUCT_NOT_FOUND", message: "The selected product is not available." } },
      { status: 400 }
    );
  }

  try {
    const submission = await quotationRequestService.create({
      ...parsed.data,
      productName: product.name,
      phone: parsed.data.phone || undefined,
      targetDate: parsed.data.targetDate || undefined,
      notes: parsed.data.notes || undefined,
      status: "Pending Review",
    });

    return NextResponse.json(
      { success: true, data: { id: submission.id } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to save quotation request:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Unable to save your quotation request right now." } },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const authError = await requireRfqAdmin(request);
  if (authError) return authError;

  try {
    const submissions = await quotationRequestService.list();
    return NextResponse.json({
      success: true,
      data: submissions.map((submission) => ({
        ...submission,
        createdAt: submission.createdAt.toDate().toISOString(),
      })),
    });
  } catch (error) {
    console.error("Failed to load quotation requests:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Unable to load quotation requests." } },
      { status: 500 }
    );
  }
}
