/**
 * Centralized frontend data services.
 * UI pages/components must use these — never raw fetch, never fixtures directly.
 * Mock mode is controlled by NEXT_PUBLIC_USE_MOCK_DATA (default: real API).
 */
import { apiRequest } from "./client";
import { endpoints } from "./endpoints";
import { config } from "@/lib/config";
import type { Banner, ChatResponse, Faq, Offer, Product } from "./types";
import { devBanners, devFaqs, devOffers, devProducts } from "@/mocks/dev-fixtures";

const cache = new Map<string, Promise<unknown>>();

function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  // In-request dedupe for server components; lightweight and bounded.
  const existing = cache.get(key);
  if (existing) return existing as Promise<T>;
  const p = load().finally(() => cache.delete(key));
  cache.set(key, p);
  return p;
}

export async function getProducts(): Promise<Product[]> {
  if (config.useMockData) return devProducts;
  return apiRequest<Product[]>(endpoints.products.list);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (config.useMockData) return devProducts.find((p) => p.slug === slug) ?? null;
  try {
    return await apiRequest<Product>(endpoints.products.detail(slug));
  } catch (err) {
    if (err instanceof Error && "status" in err && (err as { status: number }).status === 404) return null;
    throw err;
  }
}

export async function getBanners(): Promise<Banner[]> {
  if (config.useMockData) return devBanners.filter((b) => b.active);
  const banners = await apiRequest<Banner[]>(endpoints.banners.list);
  return banners.filter((b) => b.active);
}

export async function getOffers(): Promise<Offer[]> {
  if (config.useMockData) return devOffers.filter((o) => o.active);
  const offers = await apiRequest<Offer[]>(endpoints.offers.list);
  return offers.filter((o) => o.active);
}

export async function getFaqs(): Promise<Faq[]> {
  if (config.useMockData) return devFaqs.filter((f) => f.published);
  const faqs = await apiRequest<Faq[]>(endpoints.faqs.list);
  return faqs.filter((f) => f.published);
}

export async function sendChatMessage(message: string, conversationId?: string): Promise<ChatResponse> {
  // Never call an AI provider directly — always via the backend RAG endpoint.
  return apiRequest<ChatResponse>(endpoints.chat.send, {
    method: "POST",
    body: { message, conversationId },
  });
}

export async function submitContact(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot: string;
}): Promise<void> {
  await apiRequest(endpoints.contact.submit, { method: "POST", body: input });
}

export const services = {
  getProducts,
  getProductBySlug,
  getBanners,
  getOffers,
  getFaqs,
  sendChatMessage,
  submitContact,
};

export { cached };
