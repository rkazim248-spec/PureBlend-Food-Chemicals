import { config } from "@/lib/config";
import { ApiError, type ApiErrorBody } from "./types";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  /** Pass backend auth credential here once the auth mechanism is decided (TDD). */
  authToken?: string;
  signal?: AbortSignal;
};

/**
 * Single typed request helper. All API calls in the app must go through this —
 * never fetch() directly from components.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {}, authToken, signal } = options;

  const res = await fetch(`${config.apiBaseUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  if (!res.ok) {
    let errorBody: ApiErrorBody | null = null;
    try {
      errorBody = (await res.json()) as ApiErrorBody;
    } catch {
      // Non-JSON error body — fall through to generic ApiError
    }
    throw new ApiError(res.status, errorBody);
  }

  if (res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
}
