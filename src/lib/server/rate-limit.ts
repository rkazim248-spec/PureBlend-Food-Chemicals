/**
 * In-memory sliding-window rate limiter for serverless Next.js route handlers.
 * Designed to protect sensitive endpoints from abuse, credential stuffing, and spam.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

export interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

/**
 * Check and record an incoming request against a rate limit window.
 *
 * @param key Unique identifier (e.g. `login:${clientIp}` or `contact:${clientIp}`)
 * @param options Configuration for window duration and maximum hits
 */
export function checkRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const existing = rateLimitStore.get(key);

  // Periodically evict expired entries if store grows large
  if (rateLimitStore.size > 10000) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetAt < now) {
        rateLimitStore.delete(k);
      }
    }
  }

  if (!existing || existing.resetAt <= now) {
    const record: RateLimitRecord = {
      count: 1,
      resetAt: now + options.windowMs,
    };
    rateLimitStore.set(key, record);
    return {
      success: true,
      limit: options.maxRequests,
      remaining: options.maxRequests - 1,
      resetAt: record.resetAt,
    };
  }

  existing.count += 1;

  if (existing.count > options.maxRequests) {
    return {
      success: false,
      limit: options.maxRequests,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  return {
    success: true,
    limit: options.maxRequests,
    remaining: options.maxRequests - existing.count,
    resetAt: existing.resetAt,
  };
}

/**
 * Extract client IP address from incoming Next.js request headers.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1";
}
