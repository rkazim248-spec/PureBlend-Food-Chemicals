# Security Requirements

- Never expose secrets (API keys, SMTP passwords, DB URLs, AI keys) in client code or repo
- Never trust client-side authorization: backend enforces on every request
- Never rely on hidden admin buttons
- Validate all form inputs (client + server)
- Avoid rendering untrusted HTML; sanitize if unavoidable
- Safe upload handling: type/size validation, server-side checks
- Secure credential handling per auth flow
- Protect admin routes (UI guard + API 401/403)
- Rate limiting / anti-spam on contact and chat endpoints (backend)
- No sensitive info in logs; no internal errors shown to users
- HTTPS in production; secure headers (backend/hosting)
- Backend authorization is the final security boundary
