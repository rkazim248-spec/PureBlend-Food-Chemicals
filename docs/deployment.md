# PureBlend Food Chemicals — Deployment Documentation

Generated as part of Phase 10: Final Integration & Deployment Preparation.

## 1. Prerequisites

### Firebase Project

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Firebase Authentication (email/password provider)
3. Enable Firebase Admin SDK access
4. Go to Project Settings > Service Accounts > Generate new private key
5. Save the `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY`
6. The private key must have literal `\n` for newlines (not actual newlines) when placed in `.env`

### Cloudinary Account

1. Sign up at https://cloudinary.com/
2. Get credentials from Dashboard > API Credentials:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
3. Set up folder structure:
   - `pureblend/products`
   - `pureblend/banners`
   - `pureblend/general`

### SMTP Email Service

1. Obtain SMTP credentials from your email provider (SendGrid, Mailgun, Amazon SES, etc.) or on-premise server:
   - `SMTP_HOST`
   - `SMTP_PORT` (typically 587 for TLS, 465 for SSL)
   - `SMTP_USER`
   - `SMTP_PASSWORD`
2. Configure sending from: `SMTP_FROM` (e.g., `PureBlend Inquiries <no-reply@pureblend.example.com>`)
3. Configure recipient: `CONTACT_RECIPIENT` (e.g., `inquiries@pureblend.example.com`)

### OpenAI / RAG

1. Obtain OpenAI API key from https://platform.openai.com/
2. Set `RAG_SIMILARITY_THRESHOLD` (default: 0.70) — controls how closely user queries must match knowledge base content

### Frontend Configuration

1. Install PureBlend frontend at the project root or separate repo
2. Set `NEXT_PUBLIC_*` environment variables (see `docs/api.md` section 5)
3. Ensure `NEXT_PUBLIC_API_BASE_URL` points to the backend API

## 2. Environment Variables

Copy `.env.example` to `.env.local` (git-ignored) and fill in all values:

```bash
cp .env.example .env.local
```

### Firebase Admin SDK (server-only, NEVER expose to browser)

| Variable | Description | Example |
|----------|-------------|---------|
| `FIREBASE_PROJECT_ID` | Firebase project identifier | `pureblend-dev-123` |
| `FIREBASE_CLIENT_EMAIL` | Service account email | `pureblend-dev-123@appspot.gserviceaccount.com` |
| `FIREBASE_PRIVATE_KEY` | Service account private key | `-----BEGIN PRIVATE KEY-----\n...\nEND PRIVATE KEY-----\n` |

> **Important:** The private key in `.env` must have actual `\n` escape sequences, not real line breaks. When exporting from Firebase Console, replace real newlines with `\n`.

### Cloudinary (server-only)

| Variable | Description |
|----------|-------------|
| `CLOUDINARY_CLOUD_NAME` | `pureblend` |
| `CLOUDINARY_API_KEY` | `123456789012345` |
| `CLOUDINARY_API_SECRET` | `kLxYZkqR7Vv1aBcD3eFgHjK...` |

### SMTP Email (server-only)

| Variable | Description | Example |
|----------|-------------|---------|
| `SMTP_HOST` | SMTP server hostname | `smtp.sendgrid.net` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | SMTP username/email | `apikey@sendgrid.com` |
| `SMTP_PASSWORD` | SMTP password/api key | `SG.xxx.yyy` |
| `SMTP_FROM` | Email sender address | `PureBlend Inquiries <no-reply@pureblend.example.com>` |
| `CONTACT_RECIPIENT` | Email recipient for contact form | `inquiries@pureblend.example.com` |

### AI & RAG (server-only)

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key | (required) |
| `RAG_SIMILARITY_THRESHOLD` | Minimum similarity score [0-1] | `0.70` |

### Authentication (server-only)

| Variable | Description | Example |
|----------|-------------|---------|
| `AUTH_SECRET` | Secret for session/signing; generate with `openssl rand -hex 32` | `a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2` |
| `ADMIN_INITIAL_EMAIL` | Initial admin account email | `admin@pureblend.com` |
| `ADMIN_INITIAL_PASSWORD` | Initial admin password — **MUST CHANGE in production** | `ChangeMeInProduction!2026` |

### Public / Browser (safe for client bundle)

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Base API URL | (configure for production) |
| `NEXT_PUBLIC_SITE_URL` | Site URL for sitemaps/metadata | `http://localhost:3000` |
| `NEXT_PUBLIC_USE_MOCK_DATA` | Use mock data mode (dev only) | `true` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key (public) | (from Firebase console) |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `(from Firebase console)` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID (public) | `(from Firebase console)` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket (public) | `(from Firebase console)` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID (public) | `(from Firebase console)` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID (public) | `(from Firebase console)` |

### .gitignore Verification

Ensure the following are excluded from the repository (already in `.gitignore`):

- `.env*` (except `.env.example` which is committed as template)
- `.next/`
- `node_modules/`
- `.pnp/`
- `.DS_Store`
- `npm-debug.log*`
- `yarn-debug.log*`
- `.vercel/`
- `*.tsbuildinfo`
- `next-env.d.ts`
- `PureBlend Food Chemicals UI/**/*.png` (large binaries)

## 3. Build & Start Commands

```bash
# Development
npm run dev
# or with Turbopack (if configured):
# NEXT_TURBOPACK=true npm run dev

# Production build
npm run build

# Production start
npm start
```

### Verify Production Build

```bash
npm run build
```

The build must succeed without errors. If using `next start`:
```bash
npx next start -p 3000
```

## 4. Firebase Configuration

### Initialize Firebase Admin

The backend auto-initializes on first use via `src/lib/firebase/admin.ts`. It reads from:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` (with `\\n` escaped newlines)

If any of these are missing, the startup functions (`getUserByEmail`, `verifyIdToken`, etc.) will throw errors.

### Firebase Authentication

- Enable email/password sign-in in Firebase Console > Authentication > Sign-in method
- Admin claims (`role: "ADMIN"` / `role: "SUPERADMIN"`) are set via:
  - `scripts/set-admin.ts` CLI script
  - Firebase Console > Users > Select user > Custom claims
  - Never during login (this was fixed in Phase 9)

### Firestore

Ensure the following collections exist with correct data:

- `categories` — product categories
- `products` — product documents (with `published`, `featured` fields)
- `banners` — banner documents (with `active`, `startDate`, `endDate`, `displayOrder` fields)
- `offers` — offer documents (with `active`, `validFrom`, `validTo`, `status` fields)
- `faqs` — FAQ documents (with `published`, `question`, `answer` fields)
- `pages` — CMS pages (with `published`, `pageKey` fields)
- `contactMessages` — contact form submissions
- `knowledgeDocuments` — AI knowledge base documents
- `knowledgeChunks` — AI knowledge base chunks
- `adminUsers` — admin user records (optional, for additional admin metadata)
- `chatLogs` — chat conversation history (optional)

## 4. Cloudinary Configuration

### Upload Folders

The backend uses these Cloudinary folder paths:

- `pureblend/products` — product product images
- `pureblend/banners` — banner images
- `pureblend/general` — general/other images

### Image Validation

The following are strictly enforced:

- **MIME types:** `image/jpeg`, `image/png`, `image/webp`, `image/gif` (any other type returns `UNSUPPORTED_FILE_TYPE` error)
- **File size:** Maximum 5MB (`FILE_TOO_LARGE` error if exceeded)
- **Reference safety:** Before deletion, backend checks if image is referenced by products (`IMAGE_IN_USE` error if so)

### Transformation Notes

- `use_filename: true` — preserves original filename
- `unique_filename: false` — allows same filename (publicId disambiguation handled backend)
- `timeout: 30000` — 30-second upload timeout

## 5. SMTP Configuration

### Nodemailer Setup

The backend creates a nodemailer transporter:

```javascript
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? "587"),
  secure: port === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
});
```

### Contact Form Email

On `POST /api/contact` success:

```javascript
await transporter.sendMail({
  from: process.env.SMTP_FROM,
  to: process.env.CONTACT_RECIPIENT,
  replyTo: email,
  subject: `[Website Inquiry] ${subject}`,
  text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "N/A"}\nCompany: ${company || "N/A"}\nSubject: ${subject}\n\n${message}`,
  html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone || "N/A"}</p><p><strong>Company:</strong> ${company || "N/A"}</p><p><strong>Subject:</strong> ${subject}</p><hr/><p>${message}</p>`,
});
```

### Failure Behavior (Critical)

- **On SMTP success**: Client receives `200 { ok: true }`, inquiry saved to Firestore
- **On SMTP failure**: Client receives `502 { error: { code: "DELIVERY_FAILED", message: "Your inquiry has been saved, but we were unable to send the email notification. An administrator will follow up shortly." } }`, inquiry STILL saved to Firestore

This ensures no data loss even if the email gateway is temporarily unavailable.

### Test Recipient

Use a safe test email address (not production-critical) for initial verification:
```
test@yourdomain.com
```

## 6. OpenAI / RAG Configuration

### Similarity Threshold

`RAG_SIMILARITY_THRESHOLD` defaults to `0.70`. This controls the minimum cosine similarity between the user's query embedding and the knowledge base chunks for a match to be considered relevant.

- **Higher threshold** (e.g., 0.80): More strict, fewer but more relevant matches
- **Lower threshold** (e.g., 0.50): More permissive, more matches but lower quality

### Knowledge Base

The RAG system normalizes the following Firestore collections into searchable chunks:

- `knowledgeDocuments` — high-level topic documents
- `knowledgeChunks` — individual searchable text chunks with metadata (sourceType, sourceId, title, published)

The normalization is done via `src/lib/ai/knowledge.service.ts::normalizeKnowledge()`.

### Prompt Injection Protection

The `buildGroundedPrompt()` function in `src/lib/ai/schema.ts` explicitly:

- Uses only the provided knowledge context
- Refuses to answer if knowledge doesn't contain the answer
- Instructs: "If the information is not available in the context, say: 'I don't have that information available. Please contact PureBlend directly for detailed specifications.'"
- Prohibits inventing product specifications, prices, certifications, or company claims

## 6. CORS Configuration

Configure in `next.config.ts` or via hosting platform:

```javascript
// Example for next.config.ts headers
async headers() {
  return [
    {
      source: "/:path*",
      headers: [
        { key: "Access-Control-Allow-Credentials", value: "true" },
        { key: "Access-Control-Allow-Origin", value: "https://your-frontend-domain.com" },
        // ... other security headers
      ],
    },
  ];
>
```

> **Do NOT** use `Access-Control-Allow-Origin: *` if the application requires credentialed authentication requests. Restrict to specific frontend origins.

## 7. Health Check Endpoint

### `GET /api/health`

```bash
curl http://localhost:3000/api/health
```

```json
{
  "success": true,
  "data": {
    "status": "ok"
  }
}
```

**Does NOT expose any secrets or internal infrastructure details.**

Used by:
- Deployment platforms (Vercel, Render, etc.) for service health monitoring
- Deployment scripts to verify the backend is running correctly
- DNS validation and SSL certificate provisioning

## 7. Deployment Checklist

### Pre-Deployment

- [ ] All environment variables configured (no placeholder values)
- [ ] Firebase project initialized; Admin SDK credentials valid
- [ ] Cloudinary account configured; API credentials valid
- [ ] SMTP email service configured; test email sent successfully
- [ ] OpenAI API key configured; RAG knowledge base populated
- [ ] `NODE_ENV=production` set in production environment
- [ ] `AUTH_SECRET` set to a 64-character hex string
- [ ] `ADMIN_INITIAL_PASSWORD` changed from default
- [ ] `NEXT_PUBLIC_API_BASE_URL` configured for production domain
- [ ] CORS origins configured for frontend domain(s)
- [ ] Security headers verified (next.config.ts already configured)
- [ ] `npm run build` succeeds
- [ ] `npm run typecheck` passes (6 pre-existing Zod inference errors acceptable)
- [ ] `npm run lint` passes
- [ ] Health endpoint `GET /api/health` returns `200 OK`
- [ ] Test contact form submission works (SMTP or 502 failure behavior)
- [ ] AI chat endpoint `POST /api/chat` works with grounded responses
- [ ] Admin login `POST /api/login` works (does NOT promote admin claims)
- [ ] Admin endpoints return 403 for non-admin tokens
- [ ] Public endpoints accessible without authentication

### Post-Deployment

- [ ] Monitor Firestore read/write operations
- [ ] Monitor Cloudinary uploads and usage
- [ ] Monitor SMTP delivery success/failure
- [ ] Log any errors via `console.error` (sanitized — no secrets)
- [ ] Verify rate limiting is active (contact + chat endpoints)
- [ ] Check that no credentials are accidentally logged

## 8. Rollback Considerations

If deployment issues arise:

1. **Restore previous `.env` values** — if new env vars broke the build
2. **Revert Firestore rules** — if security rules blocked legitimate access
3. **Rollback Cloudinary images** — if batch upload had issues (use Cloudinary UI)
4. **Restart with `npm start`** — if `npm run build` introduced issues
5. **Contact frontend developer** — ensure frontend still connects to correct API URL

## 9. Known Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Firebase Admin SDK misconfiguration | Medium | High | Verify all three env vars (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`) are set correctly before startup |
| SMTP delivery failure | Medium | Medium | Design: inquiry still saved to Firestore even if email fails (502 response) |
| Oversized upload bypass | Low | Medium | MIME + 5MB size validation enforced in Cloudinary service layer |
| RAG hallucination (inventing specs) | Medium | High | Prompt grounding strictly limits AI to knowledge base only; refusal message if no match |
| Admin claim promotion (regression) | Low | Critical | Fixed in Phase 9; login no longer calls `setCustomUserClaims()` |
| CORS misconfiguration | Medium | Medium | Test with frontend developer; restrict to specific origins, not `*` |

## 10. Version & Contact

**Backend Repository:** PureBlend Food Chemicals  
**Phase:** 10 — Final Integration & Deployment Preparation  
**Document:** `docs/deployment.md`  

**For questions or issues, contact the backend engineering team.**

--- 

**End of Deployment Documentation**