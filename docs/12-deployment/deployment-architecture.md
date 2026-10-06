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
