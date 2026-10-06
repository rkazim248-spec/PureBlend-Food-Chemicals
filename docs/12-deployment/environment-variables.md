# Environment Variables

Copy `.env.example` to `.env` per environment. NEVER commit real values.

Frontend (public — safe to expose):
```
API_BASE_URL=<https://api.example.com>
SITE_URL=<https://www.pureblend.example>
```

Backend (secrets — never exposed to client):
```
DATABASE_URL=<SECRET>
AUTH_SECRET=<SECRET>
SMTP_HOST=<smtp.provider>
SMTP_PORT=<587>
SMTP_USER=<user>
SMTP_PASSWORD=<SECRET>
SMTP_FROM=<no-reply@example.com>
AI_API_KEY=<SECRET>
RAG_KNOWLEDGE_SOURCE=<path-or-id>
```

Rules:
- Client code must never read `DATABASE_URL`, `SMTP_PASSWORD`, `AI_API_KEY`, `AUTH_SECRET`
- Production secrets configured in hosting platform, not in repo
