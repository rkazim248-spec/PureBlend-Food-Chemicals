import type { MetadataRoute } from "next";
import { config } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/products", "/offers", "/faqs", "/contact", "/privacy-policy", "/terms-and-conditions"];
  return routes.map((path) => ({
    url: `${config.siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));
}
