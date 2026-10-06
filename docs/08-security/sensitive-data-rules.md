# Sensitive Data Rules

- `DATABASE_URL`, `SMTP_PASSWORD`, `AI_API_KEY`, `AUTH_SECRET` etc. must never appear in code, docs examples with real values, screenshots, or git history — use `<SECRET>` placeholders
- `.env` files are gitignored; provide `.env.example` with placeholders
- Admin credentials for judges are shared securely (not committed)
- Contact submissions contain user PII — restrict admin access, do not expose publicly
- No PII in analytics/logs
