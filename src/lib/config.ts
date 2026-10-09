/**
 * Central environment/configuration strategy.
 * Only intentionally-public values are exposed to the browser (NEXT_PUBLIC_*).
 * Defaults to the REAL API; mock mode must be explicitly enabled for local development.
 */
export const config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ?? "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  siteName: "PureBlend Food Chemicals",
  /**
   * Use bundled fixtures when no API base URL is configured. This keeps the
   * frontend usable without a backend and prevents requests to an empty URL.
   * A configured API can opt into fixtures explicitly for local/demo builds.
   */
  useMockData:
    process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ||
    !process.env.NEXT_PUBLIC_API_BASE_URL?.trim(),
  /** Social links are rendered only when real URLs are provided in config. */
  socials: [] as { label: string; href: string }[],
};
