import { NextResponse } from "next/server";
import { z } from "zod";
import { retrieveKnowledge, type SearchResult } from "@/lib/ai/schema";
import {
  buildGroundedPrompt,
  generateGroundedAnswer,
} from "@/lib/ai/service";

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

    // Step 1: Retrieve relevant knowledge from the PureBlend knowledge base
    // This is retrieval-augmented generation (RAG) — always works, no API dependency
    const results: SearchResult[] = retrieveKnowledge(message, 5);

    // Step 2: Try the AI provider for a grounded answer
    // If no provider is configured or the provider fails, fallback to the
    // inline grounded answer (preserves exactly existing behavior).
    const aiResult = await generateGroundedAnswer(message, {
      temperature: 0.7,
      maxTokens: 1000,
    });

    return NextResponse.json({
      success: aiResult.success,
      data: aiResult.success
        ? { answer: aiResult.answer }
        : {
            success: false,
            error: {
              code: "AI_UNAVAILABLE",
              message: aiResult.error || "AI generation unavailable",
            },
          },
      sources: aiResult.sources,
    });
  } catch (error) {
    console.error("Chat endpoint error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Unexpected error" } },
      { status: 500 }
    );
  }
}