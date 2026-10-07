import crypto from "crypto";
import { UnauthorizedError, ForbiddenError } from "./errors";

/**
 * Server-side authentication and session management utilities.
 * Uses native Node.js crypto for high performance, zero-dependency password hashing and HMAC signing.
 */

export interface AdminSession {
  userId: string;
  email: string;
  name: string;
  role: string;
  expiresAt: number;
}

const SESSION_COOKIE_NAME = "pb_session";
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Hash a plain password using crypto.scrypt (memory-hard, resistant to GPU attacks).
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

/**
 * Verify a plain password against a stored hash using constant-time comparison.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [salt, key] = storedHash.split(":");
  if (!salt || !key) return false;

  return new Promise((resolve) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return resolve(false);
      try {
        const keyBuffer = Buffer.from(key, "hex");
        const match = crypto.timingSafeEqual(keyBuffer, derivedKey);
        resolve(match);
      } catch {
        resolve(false);
      }
    });
  });
}

/**
 * Create a cryptographically signed session token.
 */
export function createSessionToken(user: { id: string; email: string; name: string; role: string }): string {
  const secret = process.env.AUTH_SECRET || "development-only-fallback-secret-key-32chars";
  const payload: AdminSession = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };

  const dataStr = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(dataStr).digest("base64url");

  return `${dataStr}.${signature}`;
}

/**
 * Verify and decode a session token.
 */
export function verifySessionToken(token: string): AdminSession | null {
  const secret = process.env.AUTH_SECRET || "development-only-fallback-secret-key-32chars";
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [dataStr, signature] = parts;
  if (!dataStr || !signature) return null;

  const expectedSig = crypto.createHmac("sha256", secret).update(dataStr).digest("base64url");
  try {
    const isSigValid = crypto.timingSafeEqual(
      Buffer.from(signature, "utf-8"),
      Buffer.from(expectedSig, "utf-8")
    );
    if (!isSigValid) return null;

    const json = Buffer.from(dataStr, "base64url").toString("utf-8");
    const session: AdminSession = JSON.parse(json);

    if (session.expiresAt < Date.now()) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

/**
 * Extract session token from cookies or Authorization Bearer header.
 */
export function extractSessionToken(request: Request): string | null {
  // Check Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7).trim();
  }

  // Check Cookie header
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    const cookies = cookieHeader.split(";").map((c) => c.trim());
    for (const c of cookies) {
      if (c.startsWith(`${SESSION_COOKIE_NAME}=`)) {
        return c.substring(SESSION_COOKIE_NAME.length + 1);
      }
    }
  }

  return null;
}

/**
 * Server-side guard: verify that the incoming request has a valid administrative session.
 * Throws UnauthorizedError or ForbiddenError if check fails.
 */
export async function requireAdminSession(request: Request): Promise<AdminSession> {
  const token = extractSessionToken(request);
  if (!token) {
    throw new UnauthorizedError("Authentication required.");
  }

  const session = verifySessionToken(token);
  if (!session) {
    throw new UnauthorizedError("Session expired or invalid.");
  }

  if (session.role !== "ADMIN" && session.role !== "SUPERADMIN") {
    throw new ForbiddenError("Administrative privileges required.");
  }

  return session;
}

export { SESSION_COOKIE_NAME, SESSION_DURATION_MS };
