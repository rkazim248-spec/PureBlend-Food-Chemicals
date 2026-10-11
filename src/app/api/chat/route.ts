import { NextResponse } from "next/server";
import { z } from "zod";
import { retrieveKnowledge, type SearchResult } from "@/lib/ai/schema";

const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 5;

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    if (checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: { code: "RATE_LIMITED", message: "Too many requests. Please try again later." } },
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

    let message = "";
    if (typeof body === "object" && body !== null && "message" in body) {
      message = String((body as { message?: unknown }).message);
    }

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Message is required." } },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Message is too long." } },
        { status: 400 }
      );
    }

    const results: SearchResult[] = retrieveKnowledge(message, 5);

    let answer = "";
    if (results.length === 0) {
      answer = "I don't have that information available. Please contact PureBlend directly for detailed specifications.";
    } else {
      const productResults = results.filter((r) => r.sourceType === "PRODUCT");
      if (productResults.length > 0 && message.toLowerCase().includes("product")) {
        answer = `Based on our knowledge base, ${productResults[0].title} is a PureBlend product. For detailed specifications including certifications, pricing, and availability, please contact PureBlend directly.`;
      } else {
        const top = results[0];
        answer = `Based on available PureBlend knowledge: ${top.content.substring(0, 300)}... For more detailed information, please contact PureBlend directly.`;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        answer,
      },
    });
  } catch (error) {
    console.error("Chat endpoint error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Unexpected error" } },
      { status: 500 }
    );
  }
}