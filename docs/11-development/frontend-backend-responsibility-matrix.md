# Frontend/Backend Responsibility Matrix

| Area | Frontend | Backend |
|---|---|---|
| Pages/UI/UX | ✅ | ➖ |
| Design system implementation | ✅ | ➖ |
| API consumed per contract | ✅ | ✅ (implements) |
| API contract definition | co-own | co-own |
| Auth UI + route guards | ✅ | ➖ |
| Auth validation, hashing, sessions | ➖ | ✅ |
| Admin CRUD UI | ✅ | ➖ |
| CRUD endpoints, persistence | ➖ | ✅ |
| SEO meta rendering | ✅ | provides data |
| SEO storage, slugs uniqueness | partial (slug input) | ✅ |
| SMTP delivery | ➖ | ✅ |
| Contact form + validation | ✅ | ✅ (server validation) |
| RAG retrieval + grounding | ➖ | ✅ (AI/RAG) |
| Chat UI | ✅ | serves responses |
| Spam protection UI (honeypot) | ✅ | ✅ (rate limit/verify) |
| Image upload UI | ✅ | ✅ (storage + validation) |
| Sitemap/robots | ➖ | ✅ or devops TDD |
| Deployment | ✅ (build config) | ✅ (hosting/secrets) |
