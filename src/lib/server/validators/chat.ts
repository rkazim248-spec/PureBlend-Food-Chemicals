import { z } from "zod";

export const chatRequestSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(500, "Message cannot exceed 500 characters"),
  conversationId: z.string().trim().max(100).optional(),
});
