import type { MetadataRoute } from "next";
import { config } from "@/lib/config";

// robots/sitemap ownership is TEAM DECISION / TO BE DECIDED; implementing the
// file routes here keeps them consistent with the frontend SEO contract.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin"] },
    sitemap: `${config.siteUrl}/sitemap.xml`,
  };
}
