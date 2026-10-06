# Frontend Data Requirements

For each entity, what the UI needs:

- **Product (list)**: name, image, short price/badge TDD, link to detail. Empty state if none.
- **Product (detail)**: name, gallery (alts), description, specifications table, SEO title/description, category.
- **Category**: name, slug — for filters and breadcrumbs.
- **Banner**: title, image (responsive), link, order, active — carousel.
- **Offer**: title, discountText, validity dates — hide expired.
- **FAQ**: question, answer, order — accordion.
- **Content**: blocks for about/privacy/terms — render safely (no raw HTML unless sanitized by backend/CMS).
- **SEO**: metaTitle/metaDescription/ogImage — injected into head per page.
- **User**: for admin session display and guard only.
- **Chat**: message + reply rendering, conversationId persistence in memory.
- **Contact**: form fields + success/error result only (no need to list submissions publicly; admin view optional TDD).

Rendering untrusted HTML: prefer markdown/structured text. If HTML is required, it must be sanitized (backend or a sanitizer library) before render.
