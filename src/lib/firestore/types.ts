import { Timestamp } from "firebase-admin/firestore";

export interface Timestampable {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Category extends Timestampable {
  id: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
}

export interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
  displayOrder: number;
  width?: number;
  height?: number;
  publicId?: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product extends Timestampable {
  id: string;
  name: string;
  slug: string;
  categoryId?: string;
  shortDescription?: string;
  description: string;
  specifications: ProductSpecification[];
  images: ProductImage[];
  featured: boolean;
  published: boolean;
  seoTitle?: string;
  metaDescription?: string;
  ogImage?: string;
}

export interface Banner extends Timestampable {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  imageAlt: string;
  linkUrl?: string;
  linkLabel?: string;
  displayOrder: number;
  active: boolean;
  startDate?: Timestamp;
  endDate?: Timestamp;
}

export interface Offer extends Timestampable {
  id: string;
  title: string;
  description?: string;
  discountText: string;
  imageUrl?: string;
  validFrom?: Timestamp;
  validTo?: Timestamp;
  active: boolean;
}

export interface FAQ extends Timestampable {
  id: string;
  question: string;
  answer: string;
  category?: string;
  displayOrder: number;
  published: boolean;
}

export interface PageSection {
  id: string;
  heading?: string;
  body: string;
  displayOrder: number;
}

export interface Page extends Timestampable {
  id: string;
  pageKey: string;
  title: string;
  published: boolean;
  sections: PageSection[];
}

export interface SEO extends Timestampable {
  id: string;
  entityType: "PRODUCT" | "PAGE" | "GLOBAL";
  entityId: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

export interface ContactMessage extends Timestampable {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  ipAddress?: string;
  status: "UNREAD" | "READ" | "ARCHIVED";
}

export interface KnowledgeDocument extends Timestampable {
  id: string;
  title: string;
  sourceType: "PRODUCT_SPEC" | "FAQ" | "CERTIFICATE" | "POLICY";
  sourceId?: string;
  rawContent: string;
  checksum: string;
}

export interface KnowledgeChunk extends Timestampable {
  id: string;
  documentId: string;
  chunkIndex: number;
  content: string;
  tokenCount: number;
  embedding?: number[];
  metadata: Record<string, unknown>;
}

export interface ChatLog extends Timestampable {
  id: string;
  conversationId: string;
  userMessage: string;
  botResponse: string;
  retrievedChunks: Array<{ chunkId: string; similarity: number }>;
  wasRefusal: boolean;
  latencyMs?: number;
}

export type CollectionName =
  | "categories"
  | "products"
  | "banners"
  | "offers"
  | "faqs"
  | "pages"
  | "seo"
  | "contactMessages"
  | "knowledgeDocuments"
  | "knowledgeChunks"
  | "chatLogs"
  | "adminUsers";

export const COLLECTIONS: Record<CollectionName, CollectionName> = {
  categories: "categories",
  products: "products",
  banners: "banners",
  offers: "offers",
  faqs: "faqs",
  pages: "pages",
  seo: "seo",
  contactMessages: "contactMessages",
  knowledgeDocuments: "knowledgeDocuments",
  knowledgeChunks: "knowledgeChunks",
  chatLogs: "chatLogs",
  adminUsers: "adminUsers",
};

export interface AdminUser extends Timestampable {
  id: string;
  email: string;
  name: string;
  role: "SUPERADMIN" | "ADMIN" | "EDITOR";
  isActive: boolean;
  lastLoginAt?: Timestamp;
}

export type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type BannerStatus = "DRAFT" | "SCHEDULED" | "ACTIVE" | "EXPIRED";
export type OfferStatus = "DRAFT" | "SCHEDULED" | "ACTIVE" | "EXPIRED";