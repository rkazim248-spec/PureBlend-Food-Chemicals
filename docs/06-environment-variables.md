# 06 — Environment Variables: PureBlend Food Chemicals

## 1. Overview

This document documents all environment variables used by the PureBlend Food Chemicals application. Variables are split into two categories:

- **`NEXT_PUBLIC_*`**: Safe for browser exposure (client-side Next.js)
- **(no prefix)**: Server-only — never committed to client bundles

## 2. Client-Safe Variables (`NEXT_PUBLIC_*`)

These variables are exposed to the browser via `process.env.NEXT_PUBLIC_*`. They must NOT contain secrets or credentials.

| Variable | Scope | Default/Notes |
|----------|-------|---------------|
| `NEXT_PUBLIC_API_BASE_URL` | Client + Server | Base API prefix (`/api/` or full URL). Leave empty for relative Next.js API routes. |
| `NEXT_PUBLIC_SITE_URL` | Client | Site URL for Open Graph, sitemap. `http://localhost:3000` by default. |
| `NEXT_PUBLIC_USE_MOCK_DATA` | Client | Toggle mock data mode. `true` = use fixtures without backend; `false` = require real API. |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Client | Firebase API key — safe for auth initialization. |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Client | Firebase auth domain (e.g., `pureblend-12345.firebaseapp.com`). |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Client | Firebase project ID. |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Client | Firebase storage bucket (e.g., `pureblend-12345.appspot.com`). |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Client | Firebase Cloud messaging sender ID. |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Client | Firebase app ID (full string: `1:123456789:web:abc123...`). |

**Security Rules**:
- All `NEXT_PUBLIC_*` variables are opt-in; if undefined, the code gracefully falls back
- Never prefix `CLOUDINARY_API_SECRET`, `FIREBASE_PRIVATE_KEY`, `SMTP_PASSWORD`, or `OPENAI_API_KEY` with `NEXT_PUBLIC_`
- The `.env.local` file (git-ignored) contains real values; `.env.example` contains only templates

---

## 3. Server-Only Variables (no prefix)

These variables must NEVER be exposed to the browser. They are accessed via `process.env.VAR_NAME` only in `src/lib/server/` or `src/app/api/...` routes.

| Variable | Scope | Source/Notes |
|----------|-------|--------------|
| `FIREBASE_PROJECT_ID` | Server | Firebase project ID. |
| `FIREBASE_CLIENT_EMAIL` | Server | Service account client email (from Firebase Console > Service Accounts). |
| `FIREBASE_PRIVATE_KEY` | Server | Service account private key (PEM format). **Must have literal `\n` escaped** for `.env` file: `PRIVATE_KEY="abc\\ndef"` → actual value `abc\ndef`. |
| `CLOUDINARY_CLOUD_NAME` | Server | Cloudinary subdomain (e.g., `pureblend-media`). |
| `CLOUDINARY_API_KEY` | Server | Cloudinary API key number. |
| `CLOUDINARY_API_SECRET` | Server | Cloudinary API secret — **CRITICAL: never expose to browser**. Used for signed upload URLs server-side only. |
| `SMTP_HOST` | Server | SMTP server hostname (e.g., `smtp.sendgrid.net`). |
| `SMTP_PORT` | Server | SMTP port number. Default: `587`. |
| `SMTP_USER` | Server | SMTP authentication username. |
| `SMTP_PASSWORD` | Server | SMTP authentication password — **CRITICAL: never expose to browser**. |
| `SMTP_FROM` | Server | Sender email address (e.g., `PureBlend Inquiries <no-reply@pureblend.example.com>`). |
| `CONTACT_RECIPIENT` | Server | Email address that receives contact form submissions. |
| `OPENAI_API_KEY` | Server | OpenAI API key (starts with `sk-`). Used for embeddings and LLM. |
| `RAG_SIMILARITY_THRESHOLD` | Server | Float 0.0–1.0. Default: `0.70`. Controls vector search strictness. |
| `AUTH_SECRET` | Server | Random 64-char hex string for custom session token signing (if used). |
| `ADMIN_INITIAL_EMAIL` | Server | Email for initial admin user creation. |
| `ADMIN_INITIAL_PASSWORD` | Server | Password for initial admin user (Firebase Auth). |

**Security Rules**:
- **NEVER** commit real values to the repository
- `.env*` secret files must be listed in `.gitignore`
- `.env.example` remains committable (contains only variable names and descriptions, no values)
- Deployment platforms (Vercel, Netlify) must have these variables configured in their dashboards, NOT in the repo
- Use `git-crypt`, `.env.gitignore`, or platform-specific secret management to protect values

---

## 4. Deprecated/Removed Variables

| Variable | Replacement | Reason |
|----------|-------------|--------|
| `DATABASE_URL` | (removed — Firebase Firestore) | Previous Prisma/PostgreSQL; no longer used |
| `DIRECT_URL` | (removed) | Prisma direct connection URL; not needed |
| `AUTH_SECRET` (custom session) | Firebase Custom Claims | Replaced by Firebase Auth + custom claims system |
| `ADMIN_INITIAL_EMAIL` / `ADMIN_INITIAL_PASSWORD` | Firebase Auth onboarding | Admin creation now via Firebase Console or `/api/auth/login` flow |

**Note**: The previous Prisma/PostgreSQL variables (`DATABASE_URL`, etc.) remain in `.env.example` with a "Deprecated" comment for reference during migration, but are no longer read by the application.

---

## 5. .env File Priority & Loading

Next.js automatically loads environment variables in this order (last wins):

1. `.env` (base, committed to repo — non-sensitive defaults only)
2. `.env.local` (overrides, **git-ignored**, contains real secrets)
3. `.env.${NODE_ENV}` (e.g., `.env.production`, `.env.development`)
4. `.env.${NODE_LOCAL}` (overrides)
5. System environment variables

**Important**: `.env.local` is automatically added to `.gitignore`. Never commit real secrets.

---

## 6. .env.example Current Content

The `.env.example` file (committable to repo) contains:

```env
# Firebase Client (safe for browser)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (server-only)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Cloudinary (server-only)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# SMTP Email (server-only)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=
CONTACT_RECIPIENT=

# AI/RAG (server-only)
OPENAI_API_KEY=
RAG_SIMILARITY_THRESHOLD=0.70

# Auth (server-only)
AUTH_SECRET=replace-with-a-secure-random-64-character-hex-string
ADMIN_INITIAL_EMAIL=admin@pureblend.com
ADMIN_INITIAL_PASSWORD=ChangeMeInProduction!2026

# Deprecated (reference only)
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pureblend?schema=public"
```

---

## 7. Adding New Environment Variables

When adding a new variable:

1. **Decide scope**: Is it `NEXT_PUBLIC_` (client-safe) or server-only?
2. **Add to `.env.example`**: Document the variable name and description
3. **Add to documentation**: Update `docs/06-environment-variables.md` (this file)
4. **Add to code**: Read via `process.env.YOUR_VAR` in appropriate location
5. **Set in deployment**: Configure the variable in your hosting platform (Vercel, Netlify, etc.)
6. **TypeScript check**: Ensure `next-env.d.ts` or TypeScript config accommodates the new variable if needed

---

## 8. Validation Checklist

Before committing any `.env*` changes:

- [ ] `.env.example` contains no secret values (only variable names and descriptions)
- [ ] No `NEXT_PUBLIC_` variable exposes `API_SECRET`, `PRIVATE_KEY`, `PASSWORD`, or `KEY`
- [ ] `.env.local` (if it exists with real values) is git-ignored
- [ ] All server-only variables have a plan for deployment configuration (Vercel/Netlify dashboard)
- [ ] No environment variable name conflicts with Next.js internal vars
- [ ] Run `npx tsc --noEmit` to ensure no type errors from new env vars