import { z } from "zod";

export const createFaqSchema = z.object({
  question: z.string().trim().min(5, "Question must be at least 5 characters").max(300),
  answer: z.string().trim().min(10, "Answer must be at least 10 characters").max(5000),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
});

export const updateFaqSchema = createFaqSchema.partial();
