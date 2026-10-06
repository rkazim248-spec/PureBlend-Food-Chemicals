import { config } from "@/lib/config";
import { ApiError, type ApiErrorBody } from "./types";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  /** Pass backend auth credential here once the auth mechanism is decided (TDD). */
  authToken?: string;
  signal?: AbortSignal;
  /** Client-side timeout in ms (default 15s). */
  timeoutMs?: number;
  query?: Record<string, string | number | boolean | undefined>;
};

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = `${config.apiBaseUrl}${path}`;
  if (!query) return url;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

/**
 * Single typed request helper. All API calls in the app must go through this —
 * never fetch() directly from components.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {}, authToken, signal, timeoutMs = 15000, query } = options;

  const timeout = AbortSignal.timeout(timeoutMs);
  const combinedSignal = signal ? AbortSignal.any([signal, timeout]) : timeout;

  let res: Response;
  try {
    res = await fetch(buildUrl(path, query), {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: combinedSignal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "TimeoutError") {
      throw new ApiError(0, { error: { code: "TIMEOUT", message: "The request timed out. Please try again." } });
    }
    throw new ApiError(0, { error: { code: "NETWORK_ERROR", message: "Unable to reach the server. Please check your connection and try again." } });
  }

  if (!res.ok) {
    let errorBody: ApiErrorBody | null = null;
    try {
      errorBody = (await res.json()) as ApiErrorBody;
    } catch {
      // Non-JSON error body — fall through to generic ApiError
    }
    throw new ApiError(res.status, errorBody);
  }

  const text = await res.text();
  if (!text) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ApiError(res.status, { error: { code: "MALFORMED_RESPONSE", message: "The server returned an unexpected response." } });
  }
}
