# Testing Strategy

Levels:
1. Unit (components/utilities) — framework test runner TDD
2. Integration (frontend ↔ API, admin CRUD flows)
3. E2E (critical journeys: browse → detail → contact; admin login → CRUD → public visible)
4. Manual QA with device/browser/responsive matrices

Principles:
- Every requirement has at least one acceptance test
- Testing loading/empty/error states explicitly
- RAG UI scenarios tested per `06-ai-rag/rag-testing-scenarios.md`
- Contact form tested end-to-end including SMTP delivery and spam rejection
- Accessibility checks via automated (axe) + keyboard walkthrough
- SEO checks via page-source inspection and Lighthouse
- Security checks: no secrets, protected admin, API rejects unauth

Test data: seeded dev database; no production secrets in tests.
