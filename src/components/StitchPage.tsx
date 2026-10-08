import { readFileSync } from "fs";
import path from "path";

/**
 * Renders a Stitch-exported static HTML page exactly as provided.
 * The Tailwind utility classes in those files are provided via the
 * shared design tokens in globals.css.
 */
export function StitchPage({ designPath }: { designPath: string }) {
  const filePath = path.join(process.cwd(), "PureBlend Food Chemicals UI", designPath, "code.html");
  const html = readFileSync(filePath, "utf-8");
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let bodyHtml = bodyMatch ? bodyMatch[1] : html;

  // Wire the design's placeholder href="#" anchors to real routes.
  const ROUTE_MAP: Record<string, string> = {
    home: "/",
    products: "/products",
    solutions: "/solutions",
    offers: "/offers",
    about: "/about",
    faqs: "/faqs",
    contact: "/contact",
    "request-quote": "/request-quote",
    "ai-assistant": "/ai-assistant",
    dashboard: "/admin",
    "batch-and-lot-coas": "/admin/batch-lot",
    categories: "/admin/categories",
    "raw-materials": "/admin/raw-materials",
    "inquiries-and-rfqs": "/admin/inquiries",
    "contracts-and-volume-bids": "/admin/contracts",
    "current-offers": "/admin/offers",
    banners: "/admin/banners",
    "audit-trail": "/admin/audit-trail",
    settings: "/admin/settings",
    login: "/admin/login",
  };
  bodyHtml = bodyHtml.replace(/data-path="contact" href="#"([^>]*)>\s*Request a Quote/g, 'data-path="request-quote" href="/request-quote"$1>Request a Quote');

  bodyHtml = bodyHtml.replace(/data-path="([^"]+)"\s+href="#"/g, (match, p: string) => {
    const route = ROUTE_MAP[p];
    return route ? `data-path="${p}" href="${route}"` : match;
  });

  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}

