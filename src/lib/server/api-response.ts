import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "./errors";

/**
 * Standard API error payload matching:
 * /docs/05-backend-integration/error-response-standard.md and src/lib/api/types.ts
 */
export interface StandardErrorPayload {
  error: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}

/**
 * Return successful JSON response.
 */
export function jsonSuccess<T>(data: T, status = 200, headers?: HeadersInit): NextResponse<T> {
  return NextResponse.json(data, { status, headers });
}

/**
 * Normalize and return standardized error response.
 * Never leaks stack traces or database driver details to clients.
 */
export function jsonError(
  err: unknown,
  defaultStatus = 500,
  defaultMessage = "An unexpected error occurred. Please try again."
): NextResponse<StandardErrorPayload> {
  // 1. Zod Validation Errors
  if (err instanceof ZodError) {
    const details = err.issues.map((issue) => ({
      field: issue.path.join(".") || "body",
      message: issue.message,
    }));
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Request validation failed.",
          details,
        },
      },
      { status: 422 }
    );
  }

  // 2. Structured App Errors
  if (err instanceof AppError) {
    return NextResponse.json(
      {
        error: {
          code: err.code,
          message: err.message,
          ...(err.details ? { details: err.details } : {}),
        },
      },
      { status: err.statusCode }
    );
  }

  // 3. Generic/Unknown Server Exceptions
  if (process.env.NODE_ENV !== "production") {
    console.error("[Backend Error]", err);
  }

  const message =
    err instanceof Error && process.env.NODE_ENV !== "production"
      ? err.message
      : defaultMessage;

  return NextResponse.json(
    {
      error: {
        code: "SERVER_ERROR",
        message,
      },
    },
    { status: defaultStatus }
  );
}
