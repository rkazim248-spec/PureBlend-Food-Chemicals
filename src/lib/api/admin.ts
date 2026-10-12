/**
 * Admin API services — all calls go through apiRequest / the Phase 3 API layer.
 * Production mode requires a valid Firebase ID token sent via
 * Authorization: Bearer <idToken> header. The backend verifies the token
 * and checks custom claims (role: "ADMIN" or "SUPERADMIN") before permitting
 * any admin operation.
 *
 * Mock mode may use fixture data, but never bypasses Firebase admin authentication.
 */

import { apiRequest } from "./client";
import { endpoints } from "./endpoints";
import { config } from "@/lib/config";
import type { Banner, Faq, Offer, Product } from "./types";
import { devBanners, devFaqs, devOffers, devProducts } from "@/mocks/dev-fixtures";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Get the current Firebase ID token from storage.
 */
function getIdToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem("pureblend.firebase.idToken") ?? undefined;
}

/**
 * Set the Firebase ID token in storage.
 */
function setIdToken(token: string | null | undefined): void {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("pureblend.firebase.idToken", token);
  } else {
    localStorage.removeItem("pureblend.firebase.idToken");
  }
}

export function clearAdminToken(): void {
  setIdToken(null);
}

/**
 * Sign in only users provisioned with an administrative Firebase custom claim.
 */
export async function login(email: string, password: string): Promise<AdminUser> {
  clearAdminToken();

  const credential = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
  const tokenResult = await credential.user.getIdTokenResult();
  const role = tokenResult.claims.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    await signOut(getFirebaseAuth());
    throw new Error("Administrative privileges required.");
  }

  const idToken = await credential.user.getIdToken();
  setIdToken(idToken);

  return {
    id: credential.user.uid,
    email: credential.user.email ?? email,
    name: credential.user.displayName ?? "",
    role,
  };
}

/** Logout: remove the Firebase ID token. */
export async function logout(): Promise<void> {
  try {
    await signOut(getFirebaseAuth());
  } catch {
    setIdToken(null);
    throw new Error("Unable to sign out from Firebase.");
  }
  setIdToken(null);
}

/** Get current authenticated admin user. */
export async function getMe(): Promise<AdminUser> {
  const token = getIdToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  // Verify via the backend — this checks Firebase ID token + custom claims
  const res = await apiRequest<{ success: boolean; data: { uid: string; email: string; name?: string; role: string } }>(endpoints.auth.me, {
    method: "GET",
    authToken: token,
  });

  return {
    id: res.data.uid,
    email: res.data.email,
    name: res.data.name ?? "",
    role: res.data.role,
  };
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