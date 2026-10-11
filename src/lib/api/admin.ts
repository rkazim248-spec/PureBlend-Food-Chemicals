/**
 * Admin API services — all calls go through apiRequest / the Phase 3 API layer.
 * Production mode requires a valid Firebase ID token sent via
 * Authorization: Bearer <idToken> header. The backend verifies the token
 * and checks custom claims (role: "ADMIN" or "SUPERADMIN") before permitting
 * any admin operation.
 *
 * Mock mode (NEXT_PUBLIC_USE_MOCK_DATA=true) is retained for local development
 * without a backend, but uses a dev user with admin claims so the UI is demoable.
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

/**
 * Get the current Firebase ID token from storage.
 * In mock mode, returns a dummy token string.
 * In production mode, reads the token from localStorage.
 */
function getIdToken(): string | undefined {
  if (config.useMockData) {
    return MOCK_SESSION_KEY; // special token that signals mock mode to apiRequest
  }
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem("pureblend.firebase.idToken") ?? undefined;
}

/**
 * Set the Firebase ID token in storage.
 */
function setIdToken(token: string | null | undefined): void {
  if (config.useMockData) {
    if (token) {
      localStorage.setItem(MOCK_SESSION_KEY, "1");
    } else {
      localStorage.removeItem(MOCK_SESSION_KEY);
    }
    return;
  }
  if (token) {
    localStorage.setItem("pureblend.firebase.idToken", token);
  } else {
    localStorage.removeItem("pureblend.firebase.idToken");
  }
}

/**
 * Login via Firebase Authentication.
 * Calls /api/auth/login which verifies credentials and sets custom claims { role: "ADMIN" }.
 */
export async function login(email: string, password: string): Promise<AdminUser> {
  if (config.useMockData) {
    if (typeof window !== "undefined") window.localStorage.setItem(MOCK_SESSION_KEY, "1");
    return mockUser;
  }

  const res = await apiRequest<{ user: AdminUser; idToken: string }>(
    endpoints.auth.login,
    { method: "POST", body: { email, password } }
  );

  // Store the real Firebase ID token so subsequent requests are authorised
  if (res.idToken) {
    setIdToken(res.idToken);
  }

  return res.user;
}

/** Logout: remove the Firebase ID token. */
export async function logout(): Promise<void> {
  if (config.useMockData) {
    if (typeof window !== "undefined") window.localStorage.removeItem(MOCK_SESSION_KEY);
    setIdToken(null);
    return;
  }

  // Call the backend logout endpoint (revokes refresh tokens if uid provided)
  try {
    await apiRequest(endpoints.auth.logout, { method: "POST" });
  } catch {
    // Best-effort — always clear local state even if backend call fails
  }
  setIdToken(null);
}

/** Get current authenticated admin user. */
export async function getMe(): Promise<AdminUser> {
  if (config.useMockData) {
    if (typeof window === "undefined" || window.localStorage.getItem(MOCK_SESSION_KEY) !== "1") {
      throw new Error("Not authenticated");
    }
    return mockUser;
  }

  const token = getIdToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  // Verify via the backend — this checks Firebase ID token + custom claims
  const res = await apiRequest<{ user: AdminUser }>(endpoints.auth.me, {
    method: "GET",
    authToken: token,
  });

  return res.user;
}

/* Products */
export async function adminGetProducts() {
  const token = getIdToken();
  return config.useMockData
    ? devProducts
    : apiRequest<Product[]>(endpoints.products.list, {
        authToken: token,
      });
}

export async function adminCreateProduct(input: Omit<Product, "id">) {
  const token = getIdToken();
  return config.useMockData
    ? ({ id: `dev-${Date.now()}`, ...input } as Product)
    : apiRequest<Product>(endpoints.products.list, {
        method: "POST",
        body: input,
        authToken: token,
      });
}
export async function adminUpdateProduct(id: string, input: Partial<Product>) {
  const token = getIdToken();
  return config.useMockData
    ? ({ id, ...input } as Product)
    : apiRequest<Product>(`${endpoints.products.list}/${id}`, {
        method: "PUT",
        body: input,
        authToken: token,
      });
}
export async function adminDeleteProduct(id: string) {
  const token = getIdToken();
  if (config.useMockData) return;
  await apiRequest(`${endpoints.products.list}/${id}`, {
    method: "DELETE",
    authToken: token,
  });
}
export async function adminSetProductPublished(id: string, published: boolean) {
  const token = getIdToken();
  return config.useMockData
    ? ({ id, published } as Product)
    : apiRequest<Product>(
        `${endpoints.products.list}/${id}/publish`,
        { method: "PATCH", body: { published }, authToken: token }
      );
}

/* Banners */
export async function adminGetBanners() {
  const token = getIdToken();
  return config.useMockData
    ? devBanners.filter((b: any) => b.active)
    : apiRequest<Banner[]>(endpoints.banners.list, { authToken: token });
}
export async function adminCreateBanner(input: Omit<Banner, "id">) {
  const token = getIdToken();
  return config.useMockData
    ? ({ id: `dev-${Date.now()}`, ...input } as Banner)
    : apiRequest<Banner>(endpoints.banners.list, {
        method: "POST",
        body: input,
        authToken: token,
      });
}
export async function adminUpdateBanner(id: string, input: Partial<Banner>) {
  const token = getIdToken();
  return config.useMockData
    ? ({ id, ...input } as Banner)
    : apiRequest<Banner>(`${endpoints.banners.list}/${id}`, {
        method: "PUT",
        body: input,
        authToken: token,
      });
}
export async function adminDeleteBanner(id: string) {
  const token = getIdToken();
  if (config.useMockData) return;
  await apiRequest(`${endpoints.banners.list}/${id}`, {
    method: "DELETE",
    authToken: token,
  });
}

/* Offers */
export async function adminGetOffers() {
  const token = getIdToken();
  return config.useMockData
    ? devOffers.filter((o: any) => o.active)
    : apiRequest<Offer[]>(endpoints.offers.list, { authToken: token });
}
export async function adminCreateOffer(input: Omit<Offer, "id">) {
  const token = getIdToken();
  return config.useMockData
    ? ({ id: `dev-${Date.now()}`, ...input } as Offer)
    : apiRequest<Offer>(endpoints.offers.list, {
        method: "POST",
        body: input,
        authToken: token,
      });
}
export async function adminUpdateOffer(id: string, input: Partial<Offer>) {
  const token = getIdToken();
  return config.useMockData
    ? ({ id, ...input } as Offer)
    : apiRequest<Offer>(`${endpoints.offers.list}/${id}`, {
        method: "PUT",
        body: input,
        authToken: token,
      });
}
export async function adminDeleteOffer(id: string) {
  const token = getIdToken();
  if (config.useMockData) return;
  await apiRequest(`${endpoints.offers.list}/${id}`, {
    method: "DELETE",
    authToken: token,
  });
}

/* FAQs */
export async function adminGetFaqs() {
  const token = getIdToken();
  return config.useMockData
    ? devFaqs.filter((f: any) => f.published)
    : apiRequest<Faq[]>(endpoints.faqs.list, { authToken: token });
}
export async function adminCreateFaq(input: Omit<Faq, "id">) {
  const token = getIdToken();
  return config.useMockData
    ? ({ id: `dev-${Date.now()}`, ...input } as Faq)
    : apiRequest<Faq>(endpoints.faqs.list, {
        method: "POST",
        body: input,
        authToken: token,
      });
}
export async function adminUpdateFaq(id: string, input: Partial<Faq>) {
  const token = getIdToken();
  return config.useMockData
    ? ({ id, ...input } as Faq)
    : apiRequest<Faq>(`${endpoints.faqs.list}/${id}`, {
        method: "PUT",
        body: input,
        authToken: token,
      });
}
export async function adminDeleteFaq(id: string) {
  const token = getIdToken();
  if (config.useMockData) return;
  await apiRequest(`${endpoints.faqs.list}/${id}`, {
    method: "DELETE",
    authToken: token,
  });
}

/* Content */
export interface ContentBlock { heading?: string; body: string }
export interface ContentPage { id: string; pageKey: string; title: string; blocks: ContentBlock[] }
export async function adminGetContent(pageKey: string): Promise<ContentPage> {
  const token = getIdToken();
  if (config.useMockData) {
    return {
      id: pageKey,
      pageKey,
      title: pageKey,
      blocks: [
        { heading: "Placeholder", body: "Development content — edit me in mock mode." },
      ],
    };
  }
  return apiRequest<ContentPage>(endpoints.content.page(pageKey), {
    authToken: token,
  });
}
export async function adminUpdateContent(
  pageKey: string,
  input: Partial<ContentPage>
) {
  const token = getIdToken();
  if (config.useMockData) {
    return { id: pageKey, pageKey, title: pageKey, blocks: [], ...input } as ContentPage;
  }
  return apiRequest<ContentPage>(endpoints.content.page(pageKey), {
    method: "PUT",
    body: input,
    authToken: token,
  });
}

/* SEO */
export interface SeoRecord {
  id?: string;
  entityType: string;
  entityId: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
}
export async function adminGetSeo(entityType: string, entityId: string): Promise<SeoRecord | null> {
  const token = getIdToken();
  if (config.useMockData) return null;
  const res = await apiRequest<SeoRecord[]>(
    `${endpoints.seo.get}?entityType=${entityType}&entityId=${entityId}`,
    { authToken: token }
  );
  return res[0] ?? null;
}
export async function adminSaveSeo(input: SeoRecord): Promise<SeoRecord> {
  const token = getIdToken();
  if (config.useMockData) return input;
  return apiRequest<SeoRecord>(endpoints.seo.get, {
    method: "PUT",
    body: input,
    authToken: token,
  });
}

// Helper: get the currently stored auth token (for use in components, guards, etc.)
export function getCurrentToken(): string | undefined {
  return getIdToken();
}