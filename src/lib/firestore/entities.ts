import {
  createDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  queryDocuments,
  getAllDocuments,
  countDocuments,
  queryDocumentsWithCursor,
} from "./service";
import { COLLECTIONS, type Category, type Product, type Banner, type Offer, type FAQ, type Page, type PageSection, type SEO, type ContactMessage, type QuotationRequest, type KnowledgeDocument, type KnowledgeChunk, type ChatLog, type AdminUser } from "./types";
import { Timestamp } from "firebase-admin/firestore";

export const categoryService = {
  async create(data: Omit<Category, "id" | "createdAt" | "updatedAt">): Promise<Category> {
    return createDocument<Category>(COLLECTIONS.categories, data);
  },

  async getById(id: string): Promise<Category | null> {
    return getDocument<Category>(COLLECTIONS.categories, id);
  },

  async getBySlug(slug: string): Promise<Category | null> {
    const results = await queryDocuments<Category>(COLLECTIONS.categories, [["slug", "==", slug]], undefined, 1);
    return results[0] || null;
  },

  async update(id: string, data: Partial<Omit<Category, "id" | "createdAt">>): Promise<Category | null> {
    return updateDocument<Category>(COLLECTIONS.categories, id, data);
  },

  async delete(id: string): Promise<boolean> {
    return deleteDocument(COLLECTIONS.categories, id);
  },

  async list(filters?: Array<[string, string, unknown]>, limit?: number, offset?: number): Promise<Category[]> {
    return queryDocuments<Category>(COLLECTIONS.categories, filters, { field: "displayOrder", direction: "asc" }, limit, offset);
  },

  async getAll(): Promise<Category[]> {
    return getAllDocuments<Category>(COLLECTIONS.categories, { field: "displayOrder", direction: "asc" });
  },

  async getPublished(): Promise<Category[]> {
    return queryDocuments<Category>(COLLECTIONS.categories, [], { field: "displayOrder", direction: "asc" });
  },

  async count(filters?: Array<[string, string, unknown]>): Promise<number> {
    return countDocuments(COLLECTIONS.categories, filters);
  },

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const results = await queryDocuments<Category>(COLLECTIONS.categories, [["slug", "==", slug]], undefined, 1);
    return results.length > 0 && results[0].id !== excludeId;
  },
};

export const productService = {
  async create(data: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
    return createDocument<Product>(COLLECTIONS.products, data);
  },

  async getById(id: string): Promise<Product | null> {
    return getDocument<Product>(COLLECTIONS.products, id);
  },

  async getBySlug(slug: string): Promise<Product | null> {
    const results = await queryDocuments<Product>(COLLECTIONS.products, [["slug", "==", slug]], undefined, 1);
    return results[0] || null;
  },

  async update(id: string, data: Partial<Omit<Product, "id" | "createdAt">>): Promise<Product | null> {
    return updateDocument<Product>(COLLECTIONS.products, id, data);
  },

  async delete(id: string): Promise<boolean> {
    return deleteDocument(COLLECTIONS.products, id);
  },

  async list(filters?: Array<[string, string, unknown]>, limit?: number, offset?: number): Promise<Product[]> {
    return queryDocuments<Product>(COLLECTIONS.products, filters, { field: "createdAt", direction: "desc" }, limit, offset);
  },

  async getPublished(limit?: number): Promise<Product[]> {
    return queryDocuments<Product>(COLLECTIONS.products, [["published", "==", true]], { field: "createdAt", direction: "desc" }, limit);
  },

  async getFeatured(limit?: number): Promise<Product[]> {
    return queryDocuments<Product>(COLLECTIONS.products, [["published", "==", true], ["featured", "==", true]], { field: "createdAt", direction: "desc" }, limit);
  },

  async getByCategory(categoryId: string, publishedOnly = true): Promise<Product[]> {
    const filters: Array<[string, string, unknown]> = [["categoryId", "==", categoryId]];
    if (publishedOnly) {
      filters.push(["published", "==", true]);
    }
    return queryDocuments<Product>(COLLECTIONS.products, filters, { field: "createdAt", direction: "desc" });
  },

  async search(query: string, limit?: number): Promise<Product[]> {
    return queryDocuments<Product>(
      COLLECTIONS.products,
      [["published", "==", true]],
      { field: "name", direction: "asc" },
      limit
    );
  },

  async count(filters?: Array<[string, string, unknown]>): Promise<number> {
    return countDocuments(COLLECTIONS.products, filters);
  },

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const results = await queryDocuments<Product>(COLLECTIONS.products, [["slug", "==", slug]], undefined, 1);
    return results.length > 0 && results[0].id !== excludeId;
  },

  async getPaginated(
    page: number,
    limit: number,
    filters?: Array<[string, string, unknown]>
  ): Promise<{ items: Product[]; total: number; page: number; totalPages: number }> {
    const offset = (page - 1) * limit;
    const items = await this.list(filters, limit, offset);
    const total = await this.count(filters);
    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },
};

export const bannerService = {
  async create(data: Omit<Banner, "id" | "createdAt" | "updatedAt">): Promise<Banner> {
    return createDocument<Banner>(COLLECTIONS.banners, data);
  },

  async getById(id: string): Promise<Banner | null> {
    return getDocument<Banner>(COLLECTIONS.banners, id);
  },

  async update(id: string, data: Partial<Omit<Banner, "id" | "createdAt">>): Promise<Banner | null> {
    return updateDocument<Banner>(COLLECTIONS.banners, id, data);
  },

  async delete(id: string): Promise<boolean> {
    return deleteDocument(COLLECTIONS.banners, id);
  },

  async list(filters?: Array<[string, string, unknown]>, limit?: number, offset?: number): Promise<Banner[]> {
    return queryDocuments<Banner>(COLLECTIONS.banners, filters, { field: "displayOrder", direction: "asc" }, limit, offset);
  },

  async getActive(): Promise<Banner[]> {
    const now = Timestamp.now();
    return queryDocuments<Banner>(
      COLLECTIONS.banners,
      [
        ["active", "==", true],
        ["startDate", "<=", now],
      ],
      { field: "displayOrder", direction: "asc" }
    );
  },

  async getAll(): Promise<Banner[]> {
    return getAllDocuments<Banner>(COLLECTIONS.banners, { field: "displayOrder", direction: "asc" });
  },

  async reorder(ids: string[]): Promise<void> {
    const operations = ids.map((id, index) => ({
      type: "update" as const,
      collection: COLLECTIONS.banners,
      id,
      data: { displayOrder: index },
    }));
    const { batchWrite } = await import("./service");
    await batchWrite(operations);
  },
};

export const offerService = {
  async create(data: Omit<Offer, "id" | "createdAt" | "updatedAt">): Promise<Offer> {
    return createDocument<Offer>(COLLECTIONS.offers, data);
  },

  async getById(id: string): Promise<Offer | null> {
    return getDocument<Offer>(COLLECTIONS.offers, id);
  },

  async update(id: string, data: Partial<Omit<Offer, "id" | "createdAt">>): Promise<Offer | null> {
    return updateDocument<Offer>(COLLECTIONS.offers, id, data);
  },

  async delete(id: string): Promise<boolean> {
    return deleteDocument(COLLECTIONS.offers, id);
  },

  async list(filters?: Array<[string, string, unknown]>, limit?: number, offset?: number): Promise<Offer[]> {
    return queryDocuments<Offer>(COLLECTIONS.offers, filters, { field: "createdAt", direction: "desc" }, limit, offset);
  },

  async getActive(): Promise<Offer[]> {
    const now = Timestamp.now();
    return queryDocuments<Offer>(
      COLLECTIONS.offers,
      [
        ["active", "==", true],
        ["validFrom", "<=", now],
        ["validTo", ">=", now],
      ],
      { field: "createdAt", direction: "desc" }
    );
  },

  async getAll(): Promise<Offer[]> {
    return getAllDocuments<Offer>(COLLECTIONS.offers, { field: "createdAt", direction: "desc" });
  },

  async count(filters?: Array<[string, string, unknown]>): Promise<number> {
    return countDocuments(COLLECTIONS.offers, filters);
  },

  async getStatus(offer: Offer): Promise<"DRAFT" | "SCHEDULED" | "ACTIVE" | "EXPIRED"> {
    const now = new Date();
    if (!offer.active) return "DRAFT";
    if (offer.validFrom && offer.validFrom.toDate() > now) return "SCHEDULED";
    if (offer.validTo && offer.validTo.toDate() < now) return "EXPIRED";
    return "ACTIVE";
  },
};

export const faqService = {
  async create(data: Omit<FAQ, "id" | "createdAt" | "updatedAt">): Promise<FAQ> {
    return createDocument<FAQ>(COLLECTIONS.faqs, data);
  },

  async getById(id: string): Promise<FAQ | null> {
    return getDocument<FAQ>(COLLECTIONS.faqs, id);
  },

  async update(id: string, data: Partial<Omit<FAQ, "id" | "createdAt">>): Promise<FAQ | null> {
    return updateDocument<FAQ>(COLLECTIONS.faqs, id, data);
  },

  async delete(id: string): Promise<boolean> {
    return deleteDocument(COLLECTIONS.faqs, id);
  },

  async list(filters?: Array<[string, string, unknown]>, limit?: number, offset?: number): Promise<FAQ[]> {
    return queryDocuments<FAQ>(COLLECTIONS.faqs, filters, { field: "displayOrder", direction: "asc" }, limit, offset);
  },

  async getPublished(): Promise<FAQ[]> {
    return queryDocuments<FAQ>(COLLECTIONS.faqs, [["published", "==", true]], { field: "displayOrder", direction: "asc" });
  },

  async getAll(): Promise<FAQ[]> {
    return getAllDocuments<FAQ>(COLLECTIONS.faqs, { field: "displayOrder", direction: "asc" });
  },

  async count(filters?: Array<[string, string, unknown]>): Promise<number> {
    return countDocuments(COLLECTIONS.faqs, filters);
  },

  async reorder(ids: string[]): Promise<void> {
    const operations = ids.map((id, index) => ({
      type: "update" as const,
      collection: COLLECTIONS.faqs,
      id,
      data: { displayOrder: index },
    }));
    const { batchWrite } = await import("./service");
    await batchWrite(operations);
  },
};

export const pageService = {
  async create(data: Omit<Page, "id" | "createdAt" | "updatedAt">): Promise<Page> {
    return createDocument<Page>(COLLECTIONS.pages, data);
  },

  async getById(id: string): Promise<Page | null> {
    return getDocument<Page>(COLLECTIONS.pages, id);
  },

  async getByKey(pageKey: string): Promise<Page | null> {
    const results = await queryDocuments<Page>(COLLECTIONS.pages, [["pageKey", "==", pageKey]], undefined, 1);
    return results[0] || null;
  },

  async update(id: string, data: Partial<Omit<Page, "id" | "createdAt">>): Promise<Page | null> {
    return updateDocument<Page>(COLLECTIONS.pages, id, data);
  },

  async delete(id: string): Promise<boolean> {
    return deleteDocument(COLLECTIONS.pages, id);
  },

  async list(): Promise<Page[]> {
    return getAllDocuments<Page>(COLLECTIONS.pages, { field: "pageKey", direction: "asc" });
  },
};

export const seoService = {
  async create(data: Omit<SEO, "id" | "createdAt" | "updatedAt">): Promise<SEO> {
    return createDocument<SEO>(COLLECTIONS.seo, data);
  },

  async getByEntity(entityType: SEO["entityType"], entityId: string): Promise<SEO | null> {
    const results = await queryDocuments<SEO>(COLLECTIONS.seo, [
      ["entityType", "==", entityType],
      ["entityId", "==", entityId],
    ], undefined, 1);
    return results[0] || null;
  },

  async upsert(entityType: SEO["entityType"], entityId: string, data: Partial<Omit<SEO, "id" | "entityType" | "entityId" | "createdAt">>): Promise<SEO> {
    const existing = await this.getByEntity(entityType, entityId);
    if (existing) {
      const updated = await updateDocument<SEO>(COLLECTIONS.seo, existing.id, data);
      return updated!;
    }
    return this.create({ entityType, entityId, ...data } as Omit<SEO, "id" | "createdAt" | "updatedAt">);
  },

  async delete(entityType: SEO["entityType"], entityId: string): Promise<boolean> {
    const existing = await this.getByEntity(entityType, entityId);
    if (!existing) return false;
    return deleteDocument(COLLECTIONS.seo, existing.id);
  },
};

export const contactService = {
  async create(data: Omit<ContactMessage, "id" | "createdAt" | "updatedAt" | "status">): Promise<ContactMessage> {
    return createDocument<ContactMessage>(COLLECTIONS.contactMessages, { ...data, status: "UNREAD" });
  },

  async getById(id: string): Promise<ContactMessage | null> {
    return getDocument<ContactMessage>(COLLECTIONS.contactMessages, id);
  },

  async list(filters?: Array<[string, string, unknown]>, limit?: number, offset?: number): Promise<ContactMessage[]> {
    return queryDocuments<ContactMessage>(COLLECTIONS.contactMessages, filters, { field: "createdAt", direction: "desc" }, limit, offset);
  },

  async updateStatus(id: string, status: ContactMessage["status"]): Promise<ContactMessage | null> {
    return updateDocument<ContactMessage>(COLLECTIONS.contactMessages, id, { status });
  },

  async count(filters?: Array<[string, string, unknown]>): Promise<number> {
    return countDocuments(COLLECTIONS.contactMessages, filters);
  },
};

export const quotationRequestService = {
  async create(data: Omit<QuotationRequest, "id" | "createdAt" | "updatedAt">): Promise<QuotationRequest> {
    return createDocument<QuotationRequest>(COLLECTIONS.quotationRequests, data);
  },

  async getById(id: string): Promise<QuotationRequest | null> {
    return getDocument<QuotationRequest>(COLLECTIONS.quotationRequests, id);
  },

  async updateStatus(id: string, status: QuotationRequest["status"]): Promise<QuotationRequest | null> {
    if (!(await this.getById(id))) return null;
    return updateDocument<QuotationRequest>(COLLECTIONS.quotationRequests, id, { status });
  },

  async list(limit = 100): Promise<QuotationRequest[]> {
    return queryDocuments<QuotationRequest>(
      COLLECTIONS.quotationRequests,
      undefined,
      { field: "createdAt", direction: "desc" },
      limit
    );
  },
};

export const knowledgeDocumentService = {
  async create(data: Omit<KnowledgeDocument, "id" | "createdAt" | "updatedAt">): Promise<KnowledgeDocument> {
    return createDocument<KnowledgeDocument>(COLLECTIONS.knowledgeDocuments, data);
  },

  async getById(id: string): Promise<KnowledgeDocument | null> {
    return getDocument<KnowledgeDocument>(COLLECTIONS.knowledgeDocuments, id);
  },

  async getBySource(sourceType: KnowledgeDocument["sourceType"], sourceId: string): Promise<KnowledgeDocument | null> {
    const results = await queryDocuments<KnowledgeDocument>(COLLECTIONS.knowledgeDocuments, [
      ["sourceType", "==", sourceType],
      ["sourceId", "==", sourceId],
    ], undefined, 1);
    return results[0] || null;
  },

  async list(filters?: Array<[string, string, unknown]>): Promise<KnowledgeDocument[]> {
    return queryDocuments<KnowledgeDocument>(COLLECTIONS.knowledgeDocuments, filters, { field: "createdAt", direction: "desc" });
  },
};

export const knowledgeChunkService = {
  async create(data: Omit<KnowledgeChunk, "id" | "createdAt" | "updatedAt">): Promise<KnowledgeChunk> {
    return createDocument<KnowledgeChunk>(COLLECTIONS.knowledgeChunks, data);
  },

  async createBatch(chunks: Array<Omit<KnowledgeChunk, "id" | "createdAt" | "updatedAt">>): Promise<KnowledgeChunk[]> {
    const operations = chunks.map((chunk) => ({
      type: "set" as const,
      collection: COLLECTIONS.knowledgeChunks,
      data: chunk,
    }));
    const { batchWrite } = await import("./service");
    await batchWrite(operations);
    return chunks as KnowledgeChunk[];
  },

  async getByDocumentId(documentId: string): Promise<KnowledgeChunk[]> {
    return queryDocuments<KnowledgeChunk>(COLLECTIONS.knowledgeChunks, [["documentId", "==", documentId]], { field: "chunkIndex", direction: "asc" });
  },

  async deleteByDocumentId(documentId: string): Promise<void> {
    const chunks = await this.getByDocumentId(documentId);
    const operations = chunks.map((chunk) => ({
      type: "delete" as const,
      collection: COLLECTIONS.knowledgeChunks,
      id: chunk.id,
    }));
    const { batchWrite } = await import("./service");
    await batchWrite(operations);
  },

  async vectorSearch(queryEmbedding: number[], limit = 4, threshold = 0.7): Promise<Array<KnowledgeChunk & { similarity: number }>> {
    // Note: Firestore doesn't natively support vector search.
    // This is a placeholder for the RAG architecture document.
    // In production, you would use a dedicated vector database (Pinecone, Weaviate, etc.)
    // or use Firebase Extensions with Vertex AI Vector Search.
    return [];
  },
};

export const chatLogService = {
  async create(data: Omit<ChatLog, "id" | "createdAt" | "updatedAt">): Promise<ChatLog> {
    return createDocument<ChatLog>(COLLECTIONS.chatLogs, data);
  },

  async getByConversationId(conversationId: string): Promise<ChatLog[]> {
    return queryDocuments<ChatLog>(COLLECTIONS.chatLogs, [["conversationId", "==", conversationId]], { field: "createdAt", direction: "asc" });
  },

  async list(filters?: Array<[string, string, unknown]>, limit?: number, offset?: number): Promise<ChatLog[]> {
    return queryDocuments<ChatLog>(COLLECTIONS.chatLogs, filters, { field: "createdAt", direction: "desc" }, limit, offset);
  },
};

export const adminUserService = {
  async create(data: Omit<AdminUser, "id" | "createdAt" | "updatedAt">): Promise<AdminUser> {
    return createDocument<AdminUser>(COLLECTIONS.adminUsers, data);
  },

  async getById(id: string): Promise<AdminUser | null> {
    return getDocument<AdminUser>(COLLECTIONS.adminUsers, id);
  },

  async getByEmail(email: string): Promise<AdminUser | null> {
    const results = await queryDocuments<AdminUser>(COLLECTIONS.adminUsers, [["email", "==", email]], undefined, 1);
    return results[0] || null;
  },

  async updateLastLogin(id: string): Promise<AdminUser | null> {
    return updateDocument<AdminUser>(COLLECTIONS.adminUsers, id, { lastLoginAt: Timestamp.now() });
  },

  async list(): Promise<AdminUser[]> {
    return getAllDocuments<AdminUser>(COLLECTIONS.adminUsers, { field: "createdAt", direction: "desc" });
  },
};