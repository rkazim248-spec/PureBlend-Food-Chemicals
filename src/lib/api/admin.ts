/**
 * Admin API services — all calls go through apiRequest / the Phase 3 API layer.
 * In NEXT_PUBLIC_USE_MOCK_DATA mode these return dev-only placeholder
 * responses (echoed input) so the admin UI is demoable without a backend.
 * Production mode calls the real documented endpoints only.
 */
import { apiRequest } from "./client";
import { endpoints } from "./endpoints";
import { config } from "@/lib/config";
import type { Banner, Faq, Offer, Product } from "./types";
import { devBanners, devFaqs, devOffers, devProducts } from "@/mocks/dev-fixtures";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

const mockUser: AdminUser = { id: "dev-admin", email: "dev@pureblend.local", name: "Dev Admin", role: "admin" };
const MOCK_SESSION_KEY = "pureblend.mock.admin";

export async function login(email: string, password: string): Promise<AdminUser> {
  if (config.useMockData) {
    if (typeof window !== "undefined") window.localStorage.setItem(MOCK_SESSION_KEY, "1");
    return mockUser;
  }
  const res = await apiRequest<{ user: AdminUser }>(endpoints.auth.login, { method: "POST", body: { email, password } });
  return res.user;
}

export async function logout(): Promise<void> {
  if (config.useMockData) {
    if (typeof window !== "undefined") window.localStorage.removeItem(MOCK_SESSION_KEY);
    return;
  }
  await apiRequest(endpoints.auth.logout, { method: "POST" });
}

export async function getMe(): Promise<AdminUser> {
  if (config.useMockData) {
    if (typeof window === "undefined" || window.localStorage.getItem(MOCK_SESSION_KEY) !== "1") {
      throw new Error("Not authenticated");
    }
    return mockUser;
  }
  return apiRequest<AdminUser>(endpoints.auth.me);
}

/* Products */
export async function adminGetProducts() { return config.useMockData ? devProducts : apiRequest<Product[]>(endpoints.products.list); }
export async function adminCreateProduct(input: Omit<Product, "id">) {
  return config.useMockData ? ({ id: `dev-${Date.now()}`, ...input } as Product) : apiRequest<Product>(endpoints.products.list, { method: "POST", body: input });
}
export async function adminUpdateProduct(id: string, input: Partial<Product>) {
  return config.useMockData ? ({ id, ...input } as Product) : apiRequest<Product>(`${endpoints.products.list}/${id}`, { method: "PUT", body: input });
}
export async function adminDeleteProduct(id: string) {
  if (!config.useMockData) await apiRequest(`${endpoints.products.list}/${id}`, { method: "DELETE" });
}
export async function adminSetProductPublished(id: string, published: boolean) {
  return config.useMockData ? ({ id, published } as Product) : apiRequest<Product>(`${endpoints.products.list}/${id}/publish`, { method: "PATCH", body: { published } });
}

/* Banners */
export async function adminGetBanners() { return config.useMockData ? devBanners : apiRequest<Banner[]>(endpoints.banners.list); }
export async function adminCreateBanner(input: Omit<Banner, "id">) {
  return config.useMockData ? ({ id: `dev-${Date.now()}`, ...input } as Banner) : apiRequest<Banner>(endpoints.banners.list, { method: "POST", body: input });
}
export async function adminUpdateBanner(id: string, input: Partial<Banner>) {
  return config.useMockData ? ({ id, ...input } as Banner) : apiRequest<Banner>(`${endpoints.banners.list}/${id}`, { method: "PUT", body: input });
}
export async function adminDeleteBanner(id: string) {
  if (!config.useMockData) await apiRequest(`${endpoints.banners.list}/${id}`, { method: "DELETE" });
}

/* Offers */
export async function adminGetOffers() { return config.useMockData ? devOffers : apiRequest<Offer[]>(endpoints.offers.list); }
export async function adminCreateOffer(input: Omit<Offer, "id">) {
  return config.useMockData ? ({ id: `dev-${Date.now()}`, ...input } as Offer) : apiRequest<Offer>(endpoints.offers.list, { method: "POST", body: input });
}
export async function adminUpdateOffer(id: string, input: Partial<Offer>) {
  return config.useMockData ? ({ id, ...input } as Offer) : apiRequest<Offer>(`${endpoints.offers.list}/${id}`, { method: "PUT", body: input });
}
export async function adminDeleteOffer(id: string) {
  if (!config.useMockData) await apiRequest(`${endpoints.offers.list}/${id}`, { method: "DELETE" });
}

/* FAQs */
export async function adminGetFaqs() { return config.useMockData ? devFaqs : apiRequest<Faq[]>(endpoints.faqs.list); }
export async function adminCreateFaq(input: Omit<Faq, "id">) {
  return config.useMockData ? ({ id: `dev-${Date.now()}`, ...input } as Faq) : apiRequest<Faq>(endpoints.faqs.list, { method: "POST", body: input });
}
export async function adminUpdateFaq(id: string, input: Partial<Faq>) {
  return config.useMockData ? ({ id, ...input } as Faq) : apiRequest<Faq>(`${endpoints.faqs.list}/${id}`, { method: "PUT", body: input });
}
export async function adminDeleteFaq(id: string) {
  if (!config.useMockData) await apiRequest(`${endpoints.faqs.list}/${id}`, { method: "DELETE" });
}

/* Content */
export interface ContentBlock { heading?: string; body: string }
export interface ContentPage { id: string; pageKey: string; title: string; blocks: ContentBlock[] }
export async function adminGetContent(pageKey: string): Promise<ContentPage> {
  if (config.useMockData) return { id: pageKey, pageKey, title: pageKey, blocks: [{ heading: "Placeholder", body: "Development content — edit me in mock mode." }] };
  return apiRequest<ContentPage>(endpoints.content.page(pageKey));
}
export async function adminUpdateContent(pageKey: string, input: Partial<ContentPage>) {
  if (config.useMockData) return { id: pageKey, pageKey, title: pageKey, blocks: [], ...input } as ContentPage;
  return apiRequest<ContentPage>(endpoints.content.page(pageKey), { method: "PUT", body: input });
}

/* SEO */
export interface SeoRecord { id?: string; entityType: string; entityId: string; metaTitle?: string; metaDescription?: string; ogImage?: string }
export async function adminGetSeo(entityType: string, entityId: string): Promise<SeoRecord | null> {
  if (config.useMockData) return null;
  const res = await apiRequest<SeoRecord[]>(`${endpoints.seo.get}?entityType=${entityType}&entityId=${entityId}`);
  return res[0] ?? null;
}
export async function adminSaveSeo(input: SeoRecord): Promise<SeoRecord> {
  if (config.useMockData) return input;
  return apiRequest<SeoRecord>(endpoints.seo.get, { method: "PUT", body: input });
}
