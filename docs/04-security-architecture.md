# 04 — Security Architecture: PureBlend Food Chemicals

## 1. Threat Model & Security Principles

As a B2B chemical platform dealing with food safety regulations, proprietary technical specifications, and administrative content management, PureBlend operates under a **Zero-Trust Backend Architecture**. The security posture adheres to the following principles:

1. **Defense in Depth**: Security controls are enforced at the network, gateway, application middleware, route handler, service layer, and database boundaries.
2. **Never Trust the Client**: Frontend checks (such as `AdminGuard`) exist solely for UX routing convenience. The authoritative security boundary is strictly enforced on the server.
3. **Principle of Least Privilege**: Serverless execution contexts only receive the minimum environment variables and database credentials required.
4. **Complete Secret Isolation**: Zero backend secrets (`DATABASE_URL`, `AUTH_SECRET`, `OPENAI_API_KEY`, `SMTP_*`, storage keys) are ever embedded in client JavaScript bundles.

---

## 2. Authentication & Session Architecture

### 2.1. Administrative Scope
PureBlend enforces authentication exclusively for administrative and CMS operators. Public visitors do not require accounts, eliminating public password databases and user-enumeration vectors.

### 2.2. Password Hashing & Storage
- Passwords are never stored in plain text or reversible encryption.
- **Algorithm**: `bcrypt` or `Argon2id` with high work factors (minimum cost factor 12 for bcrypt or recommended memory-hard Argon2id parameters).
- **Salt**: Unique cryptographically secure salt generated per user.
- **Timing Attack Resistance**: Password verification uses constant-time string comparison (`crypto.timingSafeEqual`) to prevent timing side-channel attacks.

### 2.3. Session Token & Cookie Policy
- **Transport**: Encrypted JWT or random 256-bit entropy session tokens stored in PostgreSQL or signed cryptographically with `AUTH_SECRET`.
- **Cookie Flags**:
  - `HttpOnly`: Strictly prevents client-side JavaScript (`document.cookie`) from reading or modifying the token, neutralizing XSS credential theft.
  - `Secure`: Ensures cookies are transmitted solely over HTTPS in production.
  - `SameSite=Lax`: Defends against Cross-Site Request Forgery (CSRF) on state-changing requests.
  - `Path=/`: Restricts scope to application domain.
  - `Max-Age / Expires`: Strict session lifetime (e.g., 8 hours of inactivity, absolute 24-hour expiration).

---

## 3. Server-Side Authorization & RBAC

Every API route under `/api/admin/*` and every administrative mutation executed across shared endpoints (`POST`, `PUT`, `PATCH`, `DELETE`) executes the server session verification guard before accessing any service or database function:

```typescript
// Architectural Pattern: Server-Side Guard
export async function verifyAdminSession(request: Request): Promise<AdminSession> {
  const token = getSessionTokenFromCookieOrHeader(request);
  if (!token) {
    throw new UnauthorizedException("Authentication required.");
  }
  
  const session = await validateSessionToken(token);
  if (!session || !session.isActive) {
    throw new UnauthorizedException("Session invalid or revoked.");
  }
  
  if (session.role !== "ADMIN" && session.role !== "SUPERADMIN") {
    throw new ForbiddenException("Administrative privileges required.");
  }
  
  return session;
}
```

---

## 4. Input Validation & Strict Sanitization

### 4.1. Server-Side Schema Validation with Zod
- Every request payload (`request.json()`) is parsed through a strongly typed Zod schema before executing any business logic.
- **Strict Typing**: Schemas reject extraneous, prototype-polluting, or unrecognized properties (`.strict()`).
- **Detailed Validation Errors**: Schema failures generate 422 HTTP responses with structured field-level error messages matching the `error-response-standard.md`.

### 4.2. Sanitization & Anti-Injection
- **Email Header Injection Defense**:
  In `POST /api/contact`, all user-provided strings (`email`, `subject`) are scrubbed of carriage return (`\r`) and newline (`\n`) characters before passing to SMTP headers:
  ```typescript
  const cleanHeader = (s: string) => s.replace(/[\r\n]+/g, " ").trim();
  ```
- **HTML Email Body Escaping**:
  All content injected into transactional HTML emails is strictly escaped using entity encoders (`&` &rarr; `&amp;`, `<` &rarr; `&lt;`, `>` &rarr; `&gt;`, `"` &rarr; `&quot;`).
- **SQL Injection Defense**:
  All database queries execute through Prisma ORM using parameterized queries. Raw SQL queries are prohibited except for pgvector cosine operators, which also bind parameters via `Prisma.sql`.
- **Stored XSS Defense**:
  - No `dangerouslySetInnerHTML` is used in the frontend.
  - CMS content is stored as plain structured text or sanitized markdown blocks.

---

## 5. Rate Limiting & Abuse Prevention

Rate limiting defends against credential brute-forcing, spam flooding, and API denial-of-service.

| Endpoint | Target Risk | Window | Max Requests | Storage Target | Response on Breach |
|---|---|---|---|---|---|
| `POST /api/auth/login` | Credential Brute Force | 15 minutes | 5 attempts / IP | Memory / Redis | `429 RATE_LIMITED` |
| `POST /api/contact` | Inbox Spam & SMTP flooding | 10 minutes | 5 submissions / IP| Memory / Redis | `429 RATE_LIMITED` |
| `POST /api/chat` | AI Token Exhaustion / DoS | 1 minute | 10 queries / IP | Memory / Redis | `429 RATE_LIMITED` |
| `POST /api/admin/upload`| Storage Flooding | 10 minutes | 20 uploads / Admin | Memory / Redis | `429 RATE_LIMITED` |

### Honeypot Bot Trap
`POST /api/contact` includes a hidden `honeypot` field. If automated bots fill this field:
- The server silently returns `200 OK { "ok": true }`.
- Zero database writes and zero SMTP emails are triggered.
- Bots remain unaware that their submission was rejected.

---

## 6. Secure Media & File Upload Architecture

To prevent Remote Code Execution (RCE), polyglot file uploads, and arbitrary file overwrites:
1. **No Local Filesystem Execution**: Files are never written to the local web server filesystem or served from `/public/uploads`.
2. **Buffer Validation**:
   - Max file size strictly capped at 5 MB (`5,242,880 bytes`).
   - Content-Type validated against an allowlist: `image/jpeg`, `image/png`, `image/webp`.
   - Binary header (magic numbers) inspected:
     - JPEG: `FF D8 FF`
     - PNG: `89 50 4E 47 0D 0A 1A 0A`
     - WebP: `52 49 46 46 ... 57 45 42 50`
3. **Cloud Storage Isolation**: Files are streamed directly to Cloudinary or Supabase Storage with cryptographically random UUIDs (`cuid() + ".webp"`), eliminating path traversal attacks (`../../evil.sh`).
4. **CDN Serving**: Images are served from an external CDN with `nosniff` and non-executable media headers.

---

## 7. HTTP Security Headers & Content Security Policy (CSP)

Implemented in `next.config.ts` across all HTTP responses:
- `X-Content-Type-Options: nosniff`: Prevents MIME-sniffing attacks.
- `X-Frame-Options: DENY`: Defends against clickjacking.
- `Referrer-Policy: strict-origin-when-cross-origin`: Restricts referrer information leakage.
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`: Disables unused browser hardware APIs.
- `Content-Security-Policy`:
  - `default-src 'self'`
  - `img-src 'self' data: https:`
  - `frame-ancestors 'none'`
  - `base-uri 'self'`
  - `form-action 'self'`

---

## 8. Secret Management & Audit Guardrails

1. **Environment File Hygiene**:
   - `.env` and `.env.local` containing actual credentials are strictly registered in `.gitignore`.
   - `.env.example` contains only semantic variable keys and safe placeholders.
   - Pre-commit and CI scripts execute `git diff` scans for credential patterns (`AI_API_KEY`, `DATABASE_URL`, `*_SECRET`).
2. **Safe Error Leaks**:
   - Internal stack traces, raw Prisma error codes (`P2002`), and SMTP connection logs are exclusively logged to server stderr.
   - External API error responses only expose curated, safe customer-facing messages.
