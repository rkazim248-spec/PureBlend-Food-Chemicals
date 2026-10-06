# Frontend State Strategy

- Server state (products, banners, offers, faqs, content, SEO): fetched via API client; loading/error/empty modeled explicitly
- Admin CRUD state: table data, filters, pagination, modal open state
- Chat state: conversation messages, sending flag, error
- Form state: controlled inputs, submit pending, server error mapping
- Global state: minimal — auth session, maybe UI preferences. Prefer server state + local state; global store only if approved (TDD)
- Caching/revalidation strategy: TDD based on framework
