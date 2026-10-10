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

  // The scoped layout system in globals.css (overflow guards, compact
  // sticky header and collapsed admin sidebar below 1024px) keys off
  // this wrapper class and the public/admin variant.
  const isAdmin = designPath.includes("admin");

  // Wire the design's placeholder href="#" anchors to real routes.
  const ROUTE_MAP: Record<string, string> = {
    home: "/",
    products: "/products",
    "products-management": "/admin/products",
    solutions: "/solutions",
    offers: "/offers",
    "current-offers": "/admin/offers",
    about: "/about",
    faqs: "/faqs",
    "faq-management": "/admin/faqs",
    contact: "/contact",
    "privacy-policy": "/privacy-policy",
    "privacy-compliance": "/privacy-policy",
    terms: "/terms-and-conditions",
    "terms-of-supply": "/terms-and-conditions",
    "request-a-quote": "/request-quote",
    "quote-request": "/request-quote",
    "ai-assistant": "/ai-assistant",
    dashboard: "/admin",
    "audit-trail": "/admin/audit-trail",
    "audit-log": "/admin/audit-trail",
    "audit-logs": "/admin/audit-trail",
    "batch-and-lot-coas": "/admin/batch-lot",
    "batch-lot-coas": "/admin/batch-lot",
    "batch-traceability-portal": "/admin/batch-lot",
    categories: "/admin/categories",
    "raw-materials": "/admin/raw-materials",
    "inquiries-and-rfqs": "/admin/inquiries",
    "inquiries-rfqs": "/admin/inquiries",
    "contracts-and-volume-bids": "/admin/contracts",
    "contracts-volume-bids": "/admin/contracts",
    "contracts-and-bids": "/admin/contracts",
    banners: "/admin/banners",
    settings: "/admin/settings",
    "system-settings": "/admin/settings",
    login: "/admin/login",
  };

  // The exported nav sometimes labels a link "Request a Quote" or
  // "AI Assistant" while its data-path points elsewhere (or is absent).
  // Rewrite those anchors by their visible label. Anchors are matched as
  // whole blocks first (linear scan — anchors cannot nest), so the label
  // test never runs over the full document and cannot backtrack.
  bodyHtml = bodyHtml.replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, (anchor) => {
    if (!anchor.includes('href="#"')) return anchor;
    if (/request a quote/i.test(anchor)) {
      return anchor
        .replace(/data-path="[^"]*"/, 'data-path="request-quote"')
        .replace('href="#"', 'href="/request-quote"');
    }
    if (/ai assistant/i.test(anchor)) {
      return anchor
        .replace(/data-path="[^"]*"/, 'data-path="ai-assistant"')
        .replace('href="#"', 'href="/ai-assistant"');
    }
    return anchor;
  });

  bodyHtml = bodyHtml.replace(/data-path="([^"]+)"\s+href="#"/g, (match, p: string) => {
    const route = ROUTE_MAP[p];
    return route ? `data-path="${p}" href="${route}"` : match;
  });

  // Self-host the brand lockup. The export hotlinks a Google-hosted
  // image and forces it white (brightness-0 invert), which is invisible
  // on the light page header. Swap in the local asset as-is.
  bodyHtml = bodyHtml.replace(
    /<img alt="PureBlend Brand Logo"[^>]*src="https:\/\/lh3\.googleusercontent\.com\/[^"]*"[^>]*\/>/g,
    '<img alt="PureBlend Food Chemicals logo" src="/pureblend-logo-dark.svg" class="h-8 w-auto object-contain" />'
  );
  // The lockup already contains the PUREBLEND wordmark, so drop the
  // redundant text span that sits next to the (now local) logo image.
  bodyHtml = bodyHtml.replace(
    /(<img alt="PureBlend Food Chemicals logo"[^>]*>)\s*<span[^>]*>PureBlend<\/span>/g,
    "$1"
  );

  return (
    <div
      className="stitch-page"
      data-stitch-page={isAdmin ? "admin" : "public"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: bodyHtml }}
    />
  );
}
