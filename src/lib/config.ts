/**
 * Central environment/configuration strategy.
 * Only intentionally-public values are exposed to the browser (NEXT_PUBLIC_*).
 * Defaults to the REAL API; mock mode must be explicitly enabled for local development.
 */
export const config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  siteName: "PureBlend Food Chemicals",
  /** When "true", services use /src/mocks fixtures. Any other value (including undefined) = real API. */
  useMockData: process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true",
  /** Social links are rendered only when real URLs are provided in config. */
  socials: [] as { label: string; href: string }[],
};
