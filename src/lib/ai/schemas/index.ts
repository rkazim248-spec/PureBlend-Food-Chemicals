import { z } from "zod";

// Knowledge source types
export const SourceType = z.enum(["PRODUCT", "CATEGORY", "FAQ", "CMS_PAGE", "SOLUTION", "RFQ"]);
export type SourceType = z.infer<typeof SourceType>;

// Knowledge document metadata
export const knowledgeMetadataSchema = z.object({
  sourceType: SourceType,
  sourceId: z.string(),
  title: z.string().max(200),
  productId: z.string().optional(),
  categoryId: z.string().optional(),
  published: z.boolean().default(true),
});

export type KnowledgeMetadata = z.infer<typeof knowledgeMetadataSchema>;

// Chunk schema
export const chunkSchema = z.object({
  id: z.string(),
  content: z.string().max(5000),
  metadata: knowledgeMetadataSchema,
  order: z.number().int().default(0),
  createdAt: z.date().optional(),
});

export type Chunk = z.infer<typeof chunkSchema>;

// Search result
export const searchResultSchema = z.object({
  chunk: chunkSchema,
  similarity: z.number().min(0).max(1),
  relevance: z.string(),
});

export type SearchResult = z.infer<typeof searchResultSchema>;

// Chat message
export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().max(10000),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

export const chatRequestSchema = z.object({
  message: z.string().trim().min(1, "Message is required").max(2000, "Message is too long"),
  conversationId: z.string().uuid().optional(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

export const chatResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    answer: z.string().max(2000),
    sources: z.array(
      z.object({
        sourceType: SourceType,
        title: z.string(),
        id: z.string(),
        productId: z.string().optional(),
        relevance: z.string().optional(),
      })
    ).default([]),
  }),
  error: z.object({
    code: z.string().optional(),
    message: z.string().optional(),
  }).default({}),
});

export type ChatResponse = z.infer<typeof chatResponseSchema>;

// Rate limiting
export const chatRateLimit = {
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per window
};