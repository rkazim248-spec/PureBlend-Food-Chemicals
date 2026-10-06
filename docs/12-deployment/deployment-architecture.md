# Deployment Architecture

> Hosting platform is TEAM DECISION / TO BE DECIDED (e.g. Vercel/Netlify for frontend + hosted API + managed DB).

Components:
- Frontend (static/SSR) on a hosting platform
- Backend API service (always-on or serverless TDD)
- Database (managed service TDD)
- RAG/vector store (managed or file-based TDD)
- SMTP provider (transactional email TDD)
- Domain + HTTPS via platform or DNS provider

Environments:
- Development: local machines, local env files (gitignored)
- Staging/testing: if used, mirrors production config with test credentials
- Production: live URL, real secrets in platform env settings

Data flow: Browser → Frontend → API → DB / RAG service / SMTP provider

## Implementation Notes — Phase 10 (Deployment readiness reality check)

- Verified locally: production build succeeds (`next build`), typecheck = 0, eslint clean, dev smoke tests previously passed.
- NOT done in this workspace and marked BLOCKED: live deployment, real SMTP delivery, RAG in production, database provisioning, admin-account provisioning, custom domain/HTTPS, responsive pass on a deployed URL. These require hosting/provider credentials and the backend teammate's API.
- Reproducibility documented below in `/docs/12-deployment/deployment-checklist.md` (existing) — install `npm ci`, configure `.env` from `.env.example`, `npm run build`, `npm start` behind HTTPS.
- Credential handoff: jury admin credentials and real SMTP/RAG/DB secrets must be delivered through the official submission channel, never committed.

