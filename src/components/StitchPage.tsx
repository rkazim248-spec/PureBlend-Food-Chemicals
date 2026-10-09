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
  const isAdminPage = designPath.includes("admin") || designPath.includes("audit_trail") || designPath.includes("batch_lot") || designPath.includes("inquiries") || designPath.includes("contracts") || designPath.includes("raw_materials") || designPath.includes("settings");
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let bodyHtml = bodyMatch ? bodyMatch[1] : html;

  // Exported inline demos are not wired to the application state/API layer.
  // Remove them so missing demo-only elements cannot create runtime errors.
  bodyHtml = bodyHtml
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/\s+on(?:click|submit|change|input|load)="[^"]*"/gi, "");

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
    "ai-assistant": "/",
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
    "certificate-repository": "/admin/batch-lot",
    documentation: "/faqs",
    formulations: "/",
    "media-library": "/admin/banners",
    pages: "/admin/content",
    "storefront-preview": "/",
    "users-and-roles": "/admin/settings",
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
    if (/ai assistant/i.test(anchor)) return anchor.replace('href="#"', 'href="/"');
    const labelRoutes: Array<[RegExp, string]> = [
      [/>Home</i, "/"],
      [/>Products</i, "/products"],
      [/>Solutions</i, "/solutions"],
      [/>Offers</i, "/offers"],
      [/>About</i, "/about"],
      [/>FAQs</i, "/faqs"],
      [/>Contact</i, "/contact"],
      [/view all products/i, "/products"],
      [/explore product catalog/i, "/products"],
      [/request (a|your) (formulation )?quote/i, "/request-quote"],
      [/connect with procurement desk/i, "/contact"],
      [/review supply terms/i, "/terms-and-conditions"],
      [/explore (savory )?solutions/i, "/solutions"],
      [/view .+ solutions/i, "/solutions"],
      [/explore certifications/i, "/about"],
      [/sign in/i, "/sign-in"],
      [/privacy policy/i, "/privacy-policy"],
      [/terms of supply/i, "/terms-and-conditions"],
      [/batch traceability portal/i, "/admin/batch-lot"],
    ];
    const labelRoute = labelRoutes.find(([pattern]) => pattern.test(anchor))?.[1];
    if (labelRoute) return anchor.replace('href="#"', `href="${labelRoute}"`);
    return anchor;
  });
  bodyHtml = bodyHtml.replace(/<button\b[^>]*>[\s\S]*?AI Assistant[\s\S]*?<\/button>/gi, "");

  bodyHtml = bodyHtml.replace(/data-path="([^"]+)"\s+href="#"/g, (match, p: string) => {
    const route = ROUTE_MAP[p];
    return route ? `data-path="${p}" href="${route}"` : match;
  });

  bodyHtml = bodyHtml.replace(/>PureBlend<\/span>/g, ">PureBlend</span>");
  bodyHtml = bodyHtml.replace(
    /(<img\b[^>]*alt="PureBlend Brand Logo"[^>]*src=")[^"]+(")/gi,
    '$1/pureblend-light-mode-logo.svg$2',
  );
  bodyHtml = bodyHtml.replace(
    /<img\b[^>]*alt="Profile"[^>]*\/?>/gi,
    '<div class="flex items-center gap-2 text-label-sm"><a href="/sign-in" class="rounded-lg px-3 py-2 font-semibold text-primary hover:bg-surface-container">Sign in</a><a href="/create-account" class="rounded-lg bg-primary-container px-3 py-2 font-semibold text-on-primary hover:bg-secondary">Create account</a></div>',
  );
  if (isAdminPage) {
    bodyHtml = bodyHtml.replace(
      /<div class="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center text-on-primary shadow-sm">[\s\S]*?<\/div>/i,
      '<img src="/pureblend-light-mode-logo.svg" alt="PureBlend Food Chemicals" class="h-10 w-auto object-contain" />',
    );
  }
  if (designPath.includes("banners_")) {
    bodyHtml = bodyHtml.replace(
      /src="https:\/\/lh3\.googleusercontent\.com\/[^"]+"/gi,
      'src="/pureblend-primary-logo.svg"',
    );
  }
  bodyHtml = bodyHtml.replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, (anchor) =>
    /AI Assistant/i.test(anchor) ? "" : anchor,
  );
  bodyHtml = bodyHtml.replace(/<a\b[^>]*href="#"[^>]*>[\s\S]*?<\/a>/gi, (anchor) => {
    const label = anchor.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return `<span class="cursor-not-allowed opacity-70" aria-label="${label.replace(/"/g, "&quot;")}">${label}</span>`;
  });

  if (!/<main\b/i.test(bodyHtml)) {
    bodyHtml = `<main id="main-content">${bodyHtml}</main>`;
  }

  return (
    <div
      data-stitch-page={isAdminPage ? "admin" : "public"}
      className="stitch-page"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: bodyHtml }}
    />
  );
}
