# 05 — RAG Architecture: PureBlend Food Chemicals

## 1. Overview

This document defines the Retrieval-Augmented Generation (RAG) architecture for PureBlend Food Chemicals. The system answers user questions using **approved PureBlend knowledge** only, not unrestricted general knowledge.

**Primary Goal**: Ground AI responses in verified PureBlend technical data, regulatory compliance information, certifications, and product specifications.

**Primary Constraint**: System MUST refuse to answer when sufficient approved knowledge cannot be retrieved, providing a standardized refusal message.

## 2. System Philosophy

```
+-----------------------------------------------------------+
|  User Question                                          |
|   ↓                                                       |
|  "What is the CAS number for sodium benzoate?"           |
|   ↓                                                       |
|  Approved PureBlend Knowledge ✓                         |
|   ↓                                                       |
|  Chunking & Embeddings ✓                                |
|   ↓                                                       |
|  Vector Similarity Search ✓                             |
|   ↓                                                       |
|  Relevant Context ✓                                     |
|   ↓                                                       |
|  Grounded LLM Prompt ✓                                  |
|   ↓                                                       |
|  Answer: "The CAS number for sodium benzoate is 532-32-1"|
|   ↓                                                       |
|  Sources cited + Refusal fallback ✗ (if no knowledge)   |
+-----------------------------------------------------------+
```

## 3. Data Flow Pipeline

### 3.1 Ingestion Pipeline (Admin → Knowledge Base)

```
Admin Updates Product/FAQ/Document
  │
  ├─► Extract textual representation
  │    • Product: name, description, specifications, CAS numbers
  │    • FAQ: question + answer
  │    • Document: rawContent (uploaded spec sheet, certificate)
  │
  ├─► Text Chunking
  │    • Chunk size: 500-800 tokens (~350-550 words)
  │    • Overlap: 100 tokens between adjacent chunks
  │    • Preserves semantic wholeness within each chunk
  │
  ├─► Embedding Generation
  │    • Model: OpenAI text-embedding-3-small (1536 dimensions)
  │    • Cost-optimized: smallest capable model for this domain
  │    • Normalization: L2-normalized for cosine similarity
  │
  └─► Upsert Firestore
       • documentId: auto-generated CUID
       • chunks[]: array of { chunkIndex, content, tokenCount, metadata }
       • embedding: 1536-dim float array stored in each chunk
       • checksum: MD5/SHA256 hash to detect content changes
       • sourceType: "PRODUCT_SPEC" | "FAQ" | "CERTIFICATE" | "POLICY"
       • sourceId: linked Product/FQA ID (if applicable)
```

### 3.2 Query Pipeline (User → Answer)

```
User submits question via POST /api/chat
  │
  ├─► Rate Limiter (verify user quota: 10 req/min per IP/session)
  │
  ├─► Input Validation (Zod: 1-500 chars, whitespace normalized)
  │
  ├─► Generate Query Embedding
  │    • Same model: text-embedding-3-small
  │    • Query text → 1536-dim vector
  │
  ├─► Vector Similarity Search in Firestore
  │    • CRITICAL: Firestore does NOT natively support vector search
  │    • Phase 1 approach: Linear scan of knowledgeChunks collection
  │    • Cosine similarity: 1 - (embedding <=> query_embedding)
  │    • Filter: similarity >= 0.70 (configurable via RAG_SIMILARITY_THRESHOLD)
  │    • Limit: top 4 most similar chunks
  │    • If < 4 chunks meet threshold → return fewer results
  │
  ├─► Grounding Evaluation
  │    • If NO chunks meet similarity threshold:
  │        → RETURN standardized refusal:
  │           "I do not have verified information in the PureBlend catalog to answer that question.
  │            Please contact our technical team."
  │    • If relevant chunks retrieved:
  │        → Construct strict system prompt with retrieved context
  │        → LLM generates grounded answer citing sources
  │
  ├─► LLM Orchestration
  │    • Model: gpt-4o-mini (cost-effective for technical Q&A)
  │    • System prompt includes:
  │        - "You are PureBlend's technical assistant."
  │        - "Answer ONLY using the provided context below."
  │        - "If the context does not contain sufficient information, say:"
  │          "'I do not have verified information...'"
  │        - "Cite sources by title and reference type."
  │        - "Do not use outside knowledge or make up data."
  │        - Include retrieved chunk contents as "Approved Context"
  │
  └─► Return Response
       • { reply, conversationId, sources: [{ title, url }] }
       • Persist conversation turn in ChatLog collection
```

## 4. Firestore Data Model for RAG

### 4.1 `knowledgeDocuments`

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | CUID-generated primary key |
| `title` | string | Document title (e.g., "Citric Acid Technical Data Sheet") |
| `sourceType` | string | "PRODUCT_SPEC" \| "FAQ" \| "CERTIFICATE" \| "POLICY" |
| `sourceId` | string | Linked Product or FAQ ID (optional) |
| `rawContent` | string | Full extracted text from source document |
| `checksum` | string | MD5/SHA256 hash for change detection |
| `createdAt` | Timestamp | Ingestion timestamp |
| `updatedAt` | Timestamp | Last modification |

**Indexes**: `[sourceType, sourceId]` — for efficient lookup by source

### 4.2 `knowledgeChunks`

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | CUID-generated primary key |
| `documentId` | string | Reference to `knowledgeDocuments/{id}` |
| `chunkIndex` | number | Position within source document |
| `content` | string | Chunk text (500-800 tokens) |
| `tokenCount` | number | Exact token count |
| `embedding` | number[] | **1536-dimensional float vector** |
| `metadata` | object | `{ productName, grade, CAS, complianceStandard }` |
| `createdAt` | Timestamp | Chunk generation timestamp |

**Indexes**: `[documentId]` — for retrieving all chunks of a document

## 5. Vector Search Implementation

### 5.1 Important Limitation

Firestore does NOT natively support vector similarity search (no HNSW, no IVF, no cosine index). The RAG architecture must implement similarity search at the application layer.

### 5.2 Phase 1 Implementation (Linear Scan)

```typescript
// src/lib/rag/service.ts — Phase 1 linear scan

import { getFirestoreAdmin, KnowledgeChunk } from "@/lib/firestore/types";

export async function vectorSearch(
  queryEmbedding: number[],
  limit = 4,
  threshold = 0.70  // from RAG_SIMILARITY_THRESHOLD env var
): Promise<Array<KnowledgeChunk & { similarity: number }>> {
  const db = getFirestoreAdmin();
  const snapshot = await db.collection("knowledgeChunks").get();
  
  const chunks = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as KnowledgeChunk));
  
  // Compute cosine similarity client-side (O(n) — acceptable for Phase 1, < 500 chunks)
  const scoredChunks = chunks
    .filter(chunk => chunk.embedding && chunk.embedding.length === 1536)
    .map(chunk => {
      const chunkEmbedding = chunk.embedding!;
      
      // Cosine similarity: (a · b) / (||a|| × ||b||)
      const dot = queryEmbedding.reduce((sum, q, i) => sum + q * chunkEmbedding[i], 0);
      const queryMag = Math.sqrt(queryEmbedding.reduce((sum, q) => sum + q * q, 0));
      const chunkMag = Math.sqrt(chunkEmbedding.reduce((sum, c) => sum + c * c, 0));
      const similarity = dot / (queryMag * chunkMag);
      
      return { chunk, similarity };
    })
    .filter(c => c.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
  
  return scoredChunks;
}
```

**Performance Notes**:
- Acceptable for < 500 chunks (linear scan is fast in Node.js)
- For production scale (> 1000 chunks), migrate to dedicated vector database
- Embedding dimensions: 1536 (text-embedding-3-small)

### 5.3 Production Migration Paths

| Option | Description | Cost | Complexity |
|--------|-------------|------|------------|
| **Pinecone** | Hosted vector database with HNSW/IVFFlat indexes | Pay-per-use, ~$0.003/query | Low — SDK integration |
| **Weaviate** | Open-source vector DB, self-hosted or managed | Open-source (free) or SaaS | Medium — container/setup |
| **Milvus** | Scalable vector database, ONNX integration | Enterprise licensing | High — infrastructure |
| **Firebase Vertex AI Vector Search** | Google Cloud extension, tight Firebase integration | Premium Google Cloud pricing | Medium — setup & costs |
| **Qdrant** | Vector search database, HNSW indexes | Pay-per-use or self-hosted | Low-Medium |

**Recommendation**: Start with Pinecone or Weaviate in Phase 2. Phase 1 linear scan is sufficient for hackathon/demo with ~50-100 knowledge documents.

### 5.4 Similarity Threshold Configuration

```env
# .env.example
RAG_SIMILARITY_THRESHOLD=0.70
```

- **0.70**: Default — balanced recall/precision for technical Q&A
- **0.80**: Strict — only very relevant chunks returned (fewer false positives)
- **0.60**: Lenient — more chunks returned (better recall, more noise)

Threshold can be overridden at query time if needed.

## 6. Refusal & Fallback Logic

### 6.1 When to Refuse

Return standardized refusal when:

```typescript
const relevantChunks = await vectorSearch(queryEmbedding, limit=4, threshold=0.70);
if (relevantChunks.length === 0) {
  return {
    success: false,
    error: {
      code: "KNOWLEDGE_NOT_AVAILABLE",
      message: "I do not have verified information in the PureBlend catalog to answer that question. Please contact our technical team.",
    },
  };
}
```

### 6.2 Refusal Response Format

```json
{
  "success": false,
  "error": {
    "code": "KNOWLEDGE_NOT_AVAILABLE",
    "message": "I do not have verified information in the PureBlend catalog to answer that question. Please contact our technical team."
  }
}
```

### 6.3 Partial Knowledge Handling

If some chunks meet the threshold but coverage is insufficient:

```typescript
if (relevantChunks.length > 0 && relevantChunks.length < 3) {
  // Include what we have, but add disclaimer
  reply += "\n\n*Note: This information is based on limited available documentation. For complete technical specifications, please contact our technical team.*"
}
```

### 6.4 Escalation Path

If user needs immediate technical assistance and RAG returns refusal:

1. Provide general contact information
2. Offer to open a technical sample inquiry via contact form
3. Suggest browsing the product catalog for related items
4. Log the unanswered question for knowledge-base gap analysis

## 7. Chat Log Persistence

Every chat turn is persisted for audit and context continuity:

```typescript
interface ChatLog {
  id: string;                    // CUID
  conversationId: string;        // Client-provided or generated session token
  userMessage: string;           // User's original question
  botResponse: string;           // Generated (grounded or refusal) response
  retrievedChunks: Array<{ chunkId: string; similarity: number }>; // IDs of top chunks
  wasRefusal: boolean;           // true if response was refusal
  latencyMs: number;             // End-to-end: embedding + search + LLM + persistence
  createdAt: Timestamp;          // Server timestamp
}
```

**Persistence**: `createDocument<ChatLog>(COLLECTIONS.chatLogs, { ... })`

**Retrieval**: `getChatLogsByConversationId(conversationId)` — for displaying chat history

## 8. Embedding Management

### 8.1 Chunking Guidelines

| Aspect | Recommendation |
|--------|---------------|
| **Target size** | 500-800 tokens per chunk (~350-550 words) |
| **Overlap** | 100 tokens between adjacent chunks |
| **Preserve** | Headers, bullet points, key-value pairs intact |
| **Avoid** | Chunks that split a single technical specification |

### 8.2 Example: Product Specification Chunking

**Source text**: "Sodium Benzoate Premium Grade. CAS 532-32-1. Purity: 99% min. Appearance: White crystalline powder. Solubility: Soluble in water (approx. 0.5 g/100 mL at 20°C). pH: 5-8 (1% solution)."

**Chunks**:
1. "Sodium Benzoate Premium Grade. CAS 532-32-1. Purity: 99% min."
2. "Appearance: White crystalline powder. Solubility: Soluble in water (approx. 0.5 g/100 mL at 20°C)."
3. "pH: 5-8 (1% solution)."

### 8.3 Embedding Updates

When source document content changes:
1. Compute new checksum (MD5/SHA256)
2. If checksum differs → delete old chunks → insert new chunks
3. This prevents stale embeddings from being retrieved

**Checksum storage**: `knowledgeDocuments.checksum` field

## 9. LLM Prompt Template

```text
You are PureBlend's technical assistant. Your expertise is grounded exclusively in the approved PureBlend catalog of food chemical specifications, regulatory data, and certifications.

Approved Context (from PureBlend knowledge base):
{context}

Instructions:
- Answer the user's question using ONLY the context above.
- If the context does not contain sufficient information to answer the question, say: 
  "I do not have verified information in the PureBlend catalog to answer that question. Please contact our technical team."
- Do NOT use outside knowledge or make up data, CAS numbers, or regulatory details.
- Cite your sources by title and reference type (e.g., "According to the Citric Acid Technical Data Sheet...").
- If the context contains partial information, provide what is available and add a disclaimer.
- Keep answers concise and technical for B2B procurement and formulation audiences.

User Question: {userQuestion}
```

## 10. Cost Considerations

| Component | Approximate Cost (hackathon scale) |
|-----------|-----------------------------------|
| OpenAI embeddings (text-embedding-3-small) | ~$0.0001 per 1K tokens |
| OpenAI gpt-4o-mini | ~$0.00015 per 1K input tokens, ~$0.0006 per 1K output tokens |
| Firestore storage | ~$0.18/GB/month (negligible for demo) |
| Firestore reads/writes | ~$0.06/100K operations (negligible) |

**Hackathon budget**: ~$20-50/month for moderate usage.

## 11. Phase 1 vs Phase 2 RAG Scope

| Feature | Phase 1 (Current) | Phase 2 (Planned) |
|---------|------------------|-------------------|
| Vector search method | Linear scan (application-layer cosine similarity) | Dedicated vector database (Pinecone/Weaviate) |
| Chunk count | ~50-100 documents, < 500 chunks | ~500-2000 documents, optimized indexes |
| Similarity threshold | Fixed at 0.70 (env var) | Configurable per request |
| LLM model | gpt-4o-mini | gpt-4o-mini (or gpt-4o for higher quality) |
| Refusal logic | Standardized message | Enhanced with escalation paths |
| Knowledge ingestion | Manual/admin-triggered | Automated on product/FAQ publish |
| Scale target | Demo/hackathon | Production (1000+ concurrent queries) |

## 12. Glossary

| Term | Definition |
|------|------------|
| **RAG** | Retrieval-Augmented Generation — LLM system that retrieves relevant context before generating answers |
| **Embedding** | Numerical vector representation of text semantics (1536 dim for text-embedding-3-small) |
| **Similarity** | Cosine similarity between query and chunk embeddings (range: -1 to 1, typically 0-1 for meaningful matches) |
| **Chunk** | Small piece of text extracted from a source document for embedding and retrieval |
| **Checksum** | Hash (MD5/SHA256) to detect when source content changes and chunks need regeneration |
| **Grounded** | Answer based on verified context, not unrestricted general knowledge |
| **Refusal** | System response when insufficient approved knowledge is available |

---
**Key Principle**: The RAG system is the **quality gate** between verified PureBlend data and unrestricted AI. The system must never hallucinate PureBlend data that isn't in the knowledge base. Refusal is the correct and expected behavior when the knowledge base cannot answer the question.