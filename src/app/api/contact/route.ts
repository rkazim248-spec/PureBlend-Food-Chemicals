import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

/**
 * POST /api/contact — server boundary for the contact form.
 * Validates, sanitizes, rate-limits, and delivers via SMTP.
 * Secrets come from server-only env vars; nothing sensitive reaches the client.
 */

const MAX = { name: 120, email: 200, subject: 200, message: 5000 };

// Simple in-memory rate limit (per serverless instance) — reasonable abuse protection.
const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > LIMIT;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const stripHeaderChars = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

function fail(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return fail(429, "RATE_LIMITED", "Too many submissions. Please try again later.");
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail(400, "VALIDATION_ERROR", "Invalid request body.");
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const subject = String(body.subject ?? "").trim();
  const message = String(body.message ?? "").trim();
  const honeypot = String(body.honeypot ?? "");

  // Honeypot: pretend success to avoid tipping off bots, but send nothing.
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  if (!name) return fail(422, "VALIDATION_ERROR", "Name is required.");
  if (name.length > MAX.name) return fail(422, "VALIDATION_ERROR", "Name is too long.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > MAX.email) {
    return fail(422, "VALIDATION_ERROR", "A valid email is required.");
  }
  if (!subject) return fail(422, "VALIDATION_ERROR", "Subject is required.");
  if (subject.length > MAX.subject) return fail(422, "VALIDATION_ERROR", "Subject is too long.");
  if (message.length < 10) return fail(422, "VALIDATION_ERROR", "Message must be at least 10 characters.");
  if (message.length > MAX.message) return fail(422, "VALIDATION_ERROR", "Message is too long.");

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM;
  const to = process.env.CONTACT_RECIPIENT;

  if (!host || !user || !pass || !from || !to) {
    console.error("SMTP is not configured (missing SMTP_HOST/SMTP_USER/SMTP_PASSWORD/SMTP_FROM/CONTACT_RECIPIENT).");
    return fail(503, "UNAVAILABLE", "Unable to send your message right now. Please try again later.");
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from,
      to,
      replyTo: stripHeaderChars(email),
      subject: `[Website Inquiry] ${stripHeaderChars(subject)}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
      html: `<p><strong>Name:</strong> ${esc(name)}</p><p><strong>Email:</strong> ${esc(email)}</p><p><strong>Subject:</strong> ${esc(subject)}</p><hr/><p>${esc(message).replace(/\n/g, "<br/>")}</p>`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("SMTP delivery failed:", err instanceof Error ? err.message : err);
    return fail(502, "DELIVERY_FAILED", "Unable to send your message right now. Please try again later.");
  }
}
