import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";
import { contactService } from "@/lib/firestore/entities";

/**
 * POST /api/contact — server boundary for the contact form.
 * Validates with Zod, rate-limits, saves inquiry, and delivers via SMTP.
 * Secrets come from server-only env vars; nothing sensitive reaches the client.
 */

const MAX = {
  name: 120,
  email: 200,
  phone: 50,
  company: 200,
  subject: 200,
  message: 5000,
};

const MIN = {
  message: 10,
};

const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,30}$/;

// Zod schema for contact form validation
const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(MAX.name, "Name is too long"),
  email: z
    .string()
    .trim()
    .email("A valid email is required")
    .max(MAX.email, "Email is too long"),
  phone: z.string().trim().refine((val) => !val || phoneRegex.test(val), "Phone number format is invalid"),
  company: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || val.length <= MAX.company, "Company is too long"),
  subject: z.string().trim().min(1, "Subject is required").max(MAX.subject, "Subject is too long"),
  message: z
    .string()
    .trim()
    .min(MIN.message, "Message must be at least 10 characters")
    .max(MAX.message, "Message is too long"),
});

// Type for the parsed and validated fields
type ContactFormData = z.infer<typeof contactSchema>;

function fail(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = (global as any).contactHits?.get(ip);
  if (!entry || entry.resetAt < now) {
    (global as any).contactHits = (global as any).contactHits || new Map();
    (global as any).contactHits.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 5;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: { code: "RATE_LIMITED", message: "Too many submissions. Please try again later." } },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Invalid request body." } },
      { status: 400 }
    );
  }

  const result = contactSchema.safeParse(body);

if (!result.success) {
    const errors = result.error.flatten();
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: errors.formErrors.join(". ") } },
      { status: 400 }
    );
  }

  const data: ContactFormData = result.data;

  const { name, email, phone, company, subject, message } = data;

  // Save inquiry to Firestore
  try {
    await contactService.create({
      name,
      email,
      phone: phone || undefined,
      company: company || undefined,
      subject,
      message,
    });
  } catch (saveError) {
    console.error("Failed to save contact inquiry:", saveError);
    // Continue even if Firestore save fails - we'll still try to send email
  }

  // SMTP configuration from server-only env vars
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM;
  const to = process.env.CONTACT_RECIPIENT;

  if (!host || !user || !pass || !from || !to) {
    console.error("SMTP is not configured (missing SMTP_HOST/SMTP_USER/SMTP_PASSWORD/SMTP_FROM/CONTACT_RECIPIENT).");
    return NextResponse.json(
      { error: { code: "UNAVAILABLE", message: "Unable to send your message right now. Please try again later." } },
      { status: 503 }
    );
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
      replyTo: email,
      subject: `[Website Inquiry] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "N/A"}\nCompany: ${company || "N/A"}\nSubject: ${subject}\n\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone || "N/A"}</p><p><strong>Company:</strong> ${company || "N/A"}</p><p><strong>Subject:</strong> ${subject}</p><hr/><p>${message}</p>`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("SMTP delivery failed:", err instanceof Error ? err.message : err);

    // Even if email fails, the inquiry is saved in Firestore
    return NextResponse.json(
      {
        error: {
          code: "DELIVERY_FAILED",
          message:
            "Your inquiry has been saved, but we were unable to send the email notification. An administrator will follow up shortly.",
        },
      },
      { status: 502 }
    );
  }
}