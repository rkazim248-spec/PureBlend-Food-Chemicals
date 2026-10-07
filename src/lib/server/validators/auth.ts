import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(3, "Email is required")
    .max(200, "Email cannot exceed 200 characters")
    .email("A valid email address is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters"),
});
