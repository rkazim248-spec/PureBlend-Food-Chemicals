import { retrieveKnowledge, buildGroundedPrompt, formatChatResponse, type SearchResult } from "./schema";

// AI provider types
export type AIProvider = "groq" | "openai" | "openrouter";

// AI response from provider
export interface AICompletionResponse {
  success: boolean;
  answer: string;
  sources: SearchResult[];
  error?: {
    code: string;
    message: string;
  };
}

// Configuration for each provider — model and apiKey are optional
// (defaults are provided in the provider classes).
export interface AIProviderConfig {
  provider: AIProvider;
  apiKey?: string;
  model?: string;
}

// Known models per provider
export const AI_MODELS: Record<AIProvider, string> = {
  groq: "llama-3.1-70b-versatile",
  openai: "gpt-4o-mini",
  openrouter: "mistral-7b-instruct:free",
};

// Default configuration per provider
export const DEFAULT_CONFIG: Record<AIProvider, { apiKey?: string; model?: string }> = {
  groq: {},
  openai: {},
  openrouter: {},
};

// ---------------------------------------------------------------------------
// Provider abstraction
// ---------------------------------------------------------------------------

// Response from a generation call
export type GenerationResult = {
  success: boolean;
  text: string;
  error?: string;
};

// Abstract base for all providers
export abstract class AIProviderBase {
  abstract readonly name: AIProvider;
  abstract readonly config: AIProviderConfig;

  abstract generate(
    prompt: string,
    options?: { temperature?: number; maxTokens?: number }
  ): Promise<GenerationResult>;

  abstract isConfigured(): boolean;
}

// ---------------------------------------------------------------------------
// Provider implementations
// ---------------------------------------------------------------------------

// Groq provider — OpenAI-compatible API
export class GroqProvider extends AIProviderBase {
  readonly name: AIProvider = "groq";
  readonly config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    super();
    this.config = config;
  }

  get apiBaseURL(): string {
    return "https://api.groq.com/openai/v1";
  }

  async generate(
    prompt: string,
    options?: { temperature?: number; maxTokens?: number }
  ): Promise<GenerationResult> {
    if (!this.config.apiKey) {
      return {
        success: false,
        text: "",
        error: "Missing GROQ_API_KEY environment variable",
      };
    }

    const model = this.config.model || AI_MODELS.groq;

    try {
      const response = await fetch(`${this.apiBaseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model,
          temperature: options?.temperature ?? 0.7,
          max_tokens: options?.maxTokens ?? 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        return {
          success: false,
          text: "",
          error: `Groq API error (${response.status}): ${errorBody.substring(0, 200)}`,
        };
      }

      const data = (await response.json()) as {
        choices: { message: { content: string } }[];
      };

      const text = data?.choices?.[0]?.message?.content || "";

      return {
        success: true,
        text,
        error: undefined,
      };
    } catch (err) {
      return {
        success: false,
        text: "",
        error: `Groq provider error: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }

  isConfigured(): boolean {
    return !!this.config.apiKey;
  }
}

// OpenAI provider
export class OpenAIProvider extends AIProviderBase {
  readonly name: AIProvider = "openai";
  readonly config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    super();
    this.config = config;
  }

  async generate(
    prompt: string,
    options?: { temperature?: number; maxTokens?: number }
  ): Promise<GenerationResult> {
    if (!this.config.apiKey) {
      return {
        success: false,
        text: "",
        error: "Missing OPENAI_API_KEY environment variable",
      };
    }

    const model = this.config.model || AI_MODELS.openai;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model,
          temperature: options?.temperature ?? 0.7,
          max_tokens: options?.maxTokens ?? 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        return {
          success: false,
          text: "",
          error: `OpenAI API error (${response.status}): ${errorBody.substring(0, 200)}`,
        };
      }

      const data = (await response.json()) as {
        choices: { message: { content: string } }[];
      };

      const text = data?.choices?.[0]?.message?.content || "";

      return {
        success: true,
        text,
        error: undefined,
      };
    } catch (err) {
      return {
        success: false,
        text: "",
        error: `OpenAI provider error: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }

  isConfigured(): boolean {
    return !!this.config.apiKey;
  }
}

// OpenRouter provider
export class OpenRouterProvider extends AIProviderBase {
  readonly name: AIProvider = "openrouter";
  readonly config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    super();
    this.config = config;
  }

  async generate(
    prompt: string,
    options?: { temperature?: number; maxTokens?: number }
  ): Promise<GenerationResult> {
    if (!this.config.apiKey) {
      return {
        success: false,
        text: "",
        error: "Missing OPENROUTER_API_KEY environment variable",
      };
    }

    const model = this.config.model || AI_MODELS.openrouter;

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
          "HTTP-Referer": "https://pureblend.food.chemicals",
          "X-Title": "PureBlend Food Chemicals",
        },
        body: JSON.stringify({
          model,
          temperature: options?.temperature ?? 0.7,
          max_tokens: options?.maxTokens ?? 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        return {
          success: false,
          text: "",
          error: `OpenRouter API error (${response.status}): ${errorBody.substring(0, 200)}`,
        };
      }

      const data = (await response.json()) as {
        choices: { message: { content: string } }[];
      };

      const text = data?.choices?.[0]?.message?.content || "";

      return {
        success: true,
        text,
        error: undefined,
      };
    } catch (err) {
      return {
        success: false,
        text: "",
        error: `OpenRouter provider error: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }

  isConfigured(): boolean {
    return !!this.config.apiKey;
  }
}

// ---------------------------------------------------------------------------
// Provider factory
// ---------------------------------------------------------------------------

let cachedProvider: AIProviderBase | null = null;

export function getAIProvider(
  config?: Partial<AIProviderConfig>
): AIProviderBase | null {
  const providerName = process.env.AI_PROVIDER as AIProvider | undefined ?? "groq";

  let provider: AIProviderBase | null = null;

  switch (providerName) {
    case "groq": {
      const apiKey = process.env.GROQ_API_KEY || "";
      const model = process.env.GROQ_MODEL || AI_MODELS.groq;
      provider = new GroqProvider({ provider: "groq", apiKey, model });
      break;
    }
    case "openai": {
      const apiKey = process.env.OPENAI_API_KEY || "";
      const model = process.env.OPENAI_MODEL || AI_MODELS.openai;
      provider = new OpenAIProvider({ provider: "openai", apiKey, model });
      break;
    }
    case "openrouter": {
      const apiKey = process.env.OPENROUTER_API_KEY || "";
      const model = process.env.OPENROUTER_MODEL || AI_MODELS.openrouter;
      provider = new OpenRouterProvider({ provider: "openrouter", apiKey, model });
      break;
    }
    default:
      // Fallback to groq if invalid config
      const apiKey = process.env.GROQ_API_KEY || "";
      provider = new GroqProvider({ provider: "groq", apiKey });
      break;
  }

  return provider;
}

// ---------------------------------------------------------------------------
// Generation with fallback logic
// ---------------------------------------------------------------------------

/**
 * Generate a grounded answer using the selected AI provider.
 * 
 * Retrieval-augmented flow:
 *   1. Retrieve relevant knowledge from Firestore
 *   2. Build grounded prompt using only the knowledge context
 *   3. Send to AI provider (Groq / OpenAI / OpenRouter)
 *   4. Return grounded answer (or fallback if provider fails)
 * 
 * If no API key is configured for the selected provider, the function
 * returns the inline grounded answer (preserving existing behavior).
 * 
 * @param query The user's question
 * @param options Additional options
 * @returns {Promise<{ success: boolean; answer: string; sources: SearchResult[]; error?: string }>}
 */
export async function generateGroundedAnswer(
  query: string,
  options?: {
    temperature?: number;
    maxTokens?: number;
    fallbackIfUnavailable?: boolean;
  }
): Promise<{
  success: boolean;
  answer: string;
  sources: SearchResult[];
  error?: string;
}> {
  // Step 1: Retrieve relevant knowledge (always works - no API dependency)
  const results: SearchResult[] = retrieveKnowledge(query, 5);

  // Step 2: Build grounded prompt using ONLY the knowledge context
  const prompt = buildGroundedPrompt(query, results);

  // Step 3: Get the configured AI provider
  const provider = getAIProvider();

  // Step 4: If no provider is configured, return the inline grounded answer
  // (preserves existing behavior exactly)
  if (!provider || !provider.isConfigured()) {
    if (results.length === 0) {
      return {
        success: true,
        answer: "I don't have that information available. Please contact PureBlend directly for detailed specifications.",
        sources: [],
      };
    }

    const productResults = results.filter((r) => r.sourceType === "PRODUCT");
    if (productResults.length > 0 && query.toLowerCase().includes("product")) {
      const product = productResults[0];
      return {
        success: true,
        answer: `Based on our knowledge base, ${product.title} is a PureBlend product. For detailed specifications including certifications, pricing, and availability, please contact PureBlend directly.`,
        sources: results,
      };
    }

    const top = results[0];
    return {
      success: true,
      answer: `Based on available PureBlend knowledge: ${top.content.substring(0, 300)}... For more detailed information, please contact PureBlend directly.`,
      sources: results,
    };
  }

  // Step 5: Try the AI provider
  const generationResult = await provider!.generate(
    prompt,
    { temperature: options?.temperature, maxTokens: options?.maxTokens }
  );

  if (!generationResult.success || !generationResult.text) {
    // Provider failed - fallback to inline answer
    if (results.length === 0) {
      return {
        success: true,
        answer: "I don't have that information available. Please contact PureBlend directly for detailed specifications.",
        sources: [],
      };
    }

    const productResults = results.filter((r) => r.sourceType === "PRODUCT");
    if (productResults.length > 0 && query.toLowerCase().includes("product")) {
      const product = productResults[0];
      return {
        success: true,
        answer: `Based on our knowledge base, ${product.title} is a PureBlend product. For detailed specifications including certifications, pricing, and availability, please contact PureBlend directly.`,
        sources: results,
      };
    }

    const top = results[0];
    return {
      success: true,
      answer: `Based on available PureBlend knowledge: ${top.content.substring(0, 300)}... For more detailed information, please contact PureBlend directly.`,
      sources: results,
    };
  }

  // Step 6: Parse sources from the retrieval results
  const sources: SearchResult[] = results.map((r) => ({
    chunkId: r.chunkId,
    sourceType: r.sourceType,
    title: r.title,
    content: r.content,
    productId: r.productId,
    relevance: r.relevance,
  }));

  return {
    success: true,
    answer: generationResult.text,
    sources,
  };
}

// ---------------------------------------------------------------------------
// Chat response formatting (already in schema.ts, re-exported for convenience)
// ---------------------------------------------------------------------------

export { buildGroundedPrompt, formatChatResponse } from "./schema";