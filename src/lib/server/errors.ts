/**
 * Domain error classes for PureBlend Food Chemicals backend.
 * Corresponds to /docs/05-backend-integration/error-response-standard.md
 */

export interface FieldValidationError {
  field: string;
  message: string;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: FieldValidationError[];

  constructor(
    message: string,
    statusCode = 500,
    code = "SERVER_ERROR",
    details?: FieldValidationError[]
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed.", details?: FieldValidationError[]) {
    super(message, 422, "VALIDATION_ERROR", details);
    this.name = "ValidationError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required.") {
    super(message, 401, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Access forbidden. Administrative privileges required.") {
    super(message, 403, "FORBIDDEN");
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found.") {
    super(message, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource conflict. Duplicate identifier or slug.") {
    super(message, 409, "CONFLICT");
    this.name = "ConflictError";
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too many requests. Please try again later.") {
    super(message, 429, "RATE_LIMITED");
    this.name = "RateLimitError";
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = "External service unavailable. Please try again later.") {
    super(message, 503, "UNAVAILABLE");
    this.name = "ServiceUnavailableError";
  }
}
