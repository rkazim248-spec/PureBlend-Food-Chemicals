export interface KnowledgeMetadata {
  sourceType: "PRODUCT" | "CATEGORY" | "FAQ" | "CMS_PAGE" | "SOLUTION" | "RFQ";
  sourceId: string;
  title: string;
  productId?: string;
  categoryId?: string;
  published: boolean;
}

export interface SearchResult {
  chunkId: string;
  sourceType: "PRODUCT" | "CATEGORY" | "FAQ" | "CMS_PAGE" | "SOLUTION" | "RFQ";
  title: string;
  content: string;
  productId?: string;
  relevance: number;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
}

export interface ChatResponse {
  success: boolean;
  data?: {
    answer: string;
    sources: SearchResult[];
  };
  error?: {
    code: string;
    message: string;
  };
}

export function retrieveKnowledge(query: string, limit: number): SearchResult[] {
  // Simple implementation - return empty for now
  return [];
}

export function buildGroundedPrompt(
  query: string,
  results: SearchResult[],
  systemInstruction: string = "You are a PureBlend Food Chemicals knowledge assistant."
): string {
  const groundingRules =
    "Use only the provided PureBlend knowledge below to answer the user's question.\n" +
    "Do NOT invent product specifications, prices, certifications, or company claims.\n" +
    "If the information is not available in the context, say: 'I don't have that information available. Please contact PureBlend directly for detailed specifications.'\n" +
    "Do not include any internal database IDs or implementation details in your response.\n" +
    "Provide concise, professional answers. Cite the source type when relevant.\n";

  const contextSections: string[] = [];
  for (const result of results) {
    let sourceLabel = "Source";
    if (result.sourceType === "PRODUCT") {
      sourceLabel = "Product: " + result.title;
    } else if (result.sourceType === "FAQ") {
      sourceLabel = "FAQ: " + result.title;
    } else if (result.sourceType) {
      sourceLabel = result.sourceType;
    }

    contextSections.push("[" + sourceLabel + "]: " + result.content);
  }

  const context = contextSections.length > 0 ? contextSections.join("\n\n") : "No relevant knowledge found.";

  const prompt =
    "## System Instructions\n" +
    systemInstruction +
    "\n\n" +
    groundingRules +
    "\n\n" +
    "## Available PureBlend Knowledge\n" +
    context +
    "\n\n" +
    "## User Question\n" +
    query +
    "\n\n" +
    "## Instructions\n" +
    "- Answer the user's question using only the knowledge above.\n" +
    "- If the knowledge does not contain the answer, say: \"I don't have that information available. Please contact PureBlend directly for detailed specifications.\"\n" +
    "- Do not invent product specifications, prices, certifications, or company claims.\n" +
    "- Provide a professional, helpful response.\n";

  return prompt;
}

export function formatChatResponse(
  answer: string,
  results: SearchResult[]
): { answer: string; sources: SearchResult[] } {
  const sources: SearchResult[] = results.map((r) => ({
    chunkId: r.chunkId,
    sourceType: r.sourceType,
    title: r.title,
    content: r.content,
    productId: r.productId,
    relevance: r.relevance,
  }));

  return {
    answer,
    sources,
  };
}