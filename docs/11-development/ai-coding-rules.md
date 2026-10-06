# AI Coding Rules

AI coding tools MUST:

1. Read the relevant docs first (start with `/docs/README.md`, then the domain doc)
2. Follow the existing architecture, folder structure, and design system
3. Never invent backend endpoints or database fields — check `05-backend-integration/*`
4. Never expose or hard-code secrets
5. Never replace working code unnecessarily or delete features without approval
6. Follow accessibility (`09-seo-performance/accessibility-checklist.md`) and responsive (`10-testing/responsive-test-matrix.md`) requirements
7. Add loading, error, and empty states to every dynamic feature
8. Respect frontend/backend responsibility boundaries
9. Explain major architectural decisions in the PR/commit and update docs
10. Update documentation when architecture, endpoints, or contracts change
11. Avoid fake/mock functionality in production features (mocks only for early frontend dev, clearly marked)
12. Keep generated code understandable — the jury may ask members to explain AI-assisted implementation
