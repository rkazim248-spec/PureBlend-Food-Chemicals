# Scope

## In Scope

### Public Website
- Homepage with hero + banner/carousel (database-driven)
- About page
- Products listing + product detail pages
- Offers page
- FAQs page
- Contact page (form → backend → SMTP email)
- Privacy Policy, Terms & Conditions
- 404 page
- SEO metadata per page, sitemap/robots (responsibility documented)
- AI RAG chatbot UI on public pages

### Admin Dashboard
- Login / logout
- Dashboard overview
- Product CRUD (+ publish/unpublish, images)
- Category management (if required by organizer — verify PDF)
- Banner/carousel management
- Offer management
- FAQ management
- Content management (about/privacy/terms etc.)
- SEO controls per entity

### Backend / Platform
- REST (or equivalent) API under `/api/*`
- Authentication & authorization
- SMTP contact delivery with anti-spam (e.g. honeypot/rate limit/captcha — TEAM DECISION)
- RAG retrieval service restricted to approved knowledge base
- Logging without sensitive data

### Quality Gates
- Responsive across mobile/tablet/laptop/desktop/large desktop
- Accessibility baseline (WCAG 2.1 AA intent)
- Performance budgets
- SEO checks
- Security checks

## Out of Scope
- Real payment/e-commerce checkout
- Public user accounts / order tracking
- Mobile native apps
- Multi-vendor/marketplace features
- Anything not required by the organizer statement and not approved by the team

## TEAM DECISION / TO BE DECIDED
- Exact tech stack
- Multi-role admin support
- Captcha provider for contact form
- Hosting platform

## Related Documents
- [Out of Scope](../01-requirements/out-of-scope.md)
- [Success Criteria](./success-criteria.md)
