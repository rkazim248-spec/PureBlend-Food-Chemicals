/**
 * Central public environment configuration.
 * Never read secret env vars from client code — only NEXT_PUBLIC_* values.
 */
export const config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  siteName: "PureBlend Food Chemicals",
  /** Real social URLs go here when provided by the client; links render only when set. */
  socials: [] as { label: string; href: string }[],
};
