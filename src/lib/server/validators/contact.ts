import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(120, "Name cannot exceed 120 characters"),
  email: z
    .string()
    .trim()
    .min(5, "Email is required")
    .max(200, "Email cannot exceed 200 characters")
    .email("A valid email address is required"),
  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters")
    .max(200, "Subject cannot exceed 200 characters"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message cannot exceed 5000 characters"),
  honeypot: z.string().optional().default(""),
});
