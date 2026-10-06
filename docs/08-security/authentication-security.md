# Authentication Security

- Strong password hashing is backend responsibility (bcrypt/argon2 TDD)
- Rate limit login attempts (backend)
- Session/token expiry and refresh strategy TDD
- Logout invalidates server-side session/token where applicable
- Protect admin routes in UI and enforce 401/403 from API
- Never expose password or token in URLs, logs, or error messages
