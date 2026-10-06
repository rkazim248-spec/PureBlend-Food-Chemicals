/**
 * Endpoint definitions from /docs/05-backend-integration/api-endpoints.md.
 * Implemented gradually as backend endpoints are finalized.
 */
export const endpoints = {
  auth: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    me: "/api/auth/me",
  },
  products: {
    list: "/api/products",
    detail: (slug: string) => `/api/products/${slug}`,
  },
  banners: { list: "/api/banners" },
  offers: { list: "/api/offers" },
  faqs: { list: "/api/faqs" },
  content: { page: (pageKey: string) => `/api/content/${pageKey}` },
  seo: { get: "/api/seo" },
  contact: { submit: "/api/contact" },
  chat: { send: "/api/chat" },
} as const;

/*
 * TODO integration points:
 * - Implement typed service functions (getProducts, getProductBySlug, sendChat, ...)
 *   in src/lib/api/services.ts once backend endpoints are finalized.
 * - Today, pages render clearly-marked development fixtures from src/data/.
 */
