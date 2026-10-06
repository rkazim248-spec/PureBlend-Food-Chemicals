/**
 * Shared API types — mirrors /docs/05-backend-integration/request-response-models.md
 * Field details are TEAM DECISION / TO BE DECIDED until the backend finalizes the schema.
 */

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  specifications?: { label: string; value: string }[];
  images: { url: string; alt: string }[];
  category?: { id: string; name: string; slug: string } | null;
  published: boolean;
  seo?: SeoFields;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Banner {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  imageAlt: string;
  linkUrl?: string;
  linkLabel?: string;
  order: number;
  active: boolean;
}

export interface Offer {
  id: string;
  title: string;
  description?: string;
  discountText: string;
  validFrom?: string;
  validTo?: string;
  active: boolean;
  imageUrl?: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  order: number;
  published: boolean;
}

export interface SeoFields {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
}

export interface ChatResponse {
  reply: string;
  conversationId: string;
  sources?: { title: string; url?: string }[];
}

/** Standard API error shape — /docs/05-backend-integration/error-response-standard.md */
export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: { field: string; message: string }[];
  };
}

export class ApiError extends Error {
  code: string;
  status: number;
  details?: { field: string; message: string }[];

  constructor(status: number, body: ApiErrorBody | null) {
    super(body?.error?.message ?? "Something went wrong. Please try again.");
    this.name = "ApiError";
    this.status = status;
    this.code = body?.error?.code ?? "UNKNOWN";
    this.details = body?.error?.details;
  }
}
