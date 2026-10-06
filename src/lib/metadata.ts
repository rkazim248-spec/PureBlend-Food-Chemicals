import type { Metadata } from "next";
import { config } from "@/lib/config";

interface PageMeta {
  title: string;
  description: string;
  path?: string;
}

export function pageMetadata({ title, description, path = "" }: PageMeta): Metadata {
  return {
    title,
    description,
    alternates: { canonical: `${config.siteUrl}${path}` },
    openGraph: {
      title: `${title} | ${config.siteName}`,
      description,
      url: `${config.siteUrl}${path}`,
      siteName: config.siteName,
      type: "website",
    },
  };
}
