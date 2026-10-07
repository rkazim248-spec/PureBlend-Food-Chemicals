# 06 — Environment Variables Strategy: PureBlend Food Chemicals

## 1. Environment Variable Architecture & Security Philosophy

Environment variables in **PureBlend Food Chemicals** follow strict segmentation between public browser configuration and server-only cryptographic secrets.

### Cardinal Rules
1. **Never Commit Secrets**: No real database connection strings, API tokens, passwords, or encryption keys may ever be committed to the Git repository.
2. **Next.js Prefix Isolation**: Only variables explicitly prefixed with `NEXT_PUBLIC_` are bundled into client-side JavaScript. All other variables are server-only.
3. **Fail-Fast Server Validation**: Missing required server environment variables during production initialization trigger immediate application startup errors rather than silent runtime failures.
4. **Git Hygiene**: `.env` and `.env.local` are explicitly ignored in `.gitignore`. Only `.env.example`, `.env.development`, and `.env.production` (containing public flags and placeholders only) are tracked in version control.

---

## 2. Environment Variables Inventory

### 2.1. Client-Facing Public Variables (Browser Accessible)

These variables configure frontend routing, base API domains, and mock data toggles. They contain **zero confidential credentials**.

| Variable Name | Purpose | Scope | Example / Default | Required in Prod? |
|---|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical origin URL for Open Graph and sitemaps | Client + Server | `https://www.pureblend.example.com` | Yes |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for API calls (empty string for same-origin relative calls) | Client | `""` (empty for same-origin Next.js routes) | No |
| `NEXT_PUBLIC_USE_MOCK_DATA` | Development toggle to use mock fixtures when backend is detached | Client + Server | `"false"` (must be `false` in production) | Yes |

---

### 2.2. Server-Only Secrets & Infrastructure Credentials

These variables are **never exposed to the browser**. They are consumed exclusively by Next.js Route Handlers (`src/app/api/...`), Server Components, and the backend service layer (`src/lib/server/...`).

#### A. Database & ORM
| Variable Name | Purpose | Scope | Format / Example |
|---|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string for Prisma ORM | Server Only | `postgresql://user:password@db.provider.com:5432/pureblend?sslmode=require` |
| `DIRECT_URL` | Direct unpooled connection URL (required for Supabase/Neon migrations) | Server Only | `postgresql://user:password@db.provider.com:5432/pureblend?sslmode=require` |

#### B. Authentication & Session Security
| Variable Name | Purpose | Scope | Format / Example |
|---|---|---|---|
| `AUTH_SECRET` | Cryptographic secret key used to sign and verify administrative session tokens / cookies | Server Only | 64-character hexadecimal or base64 string (`openssl rand -hex 32`) |
| `ADMIN_INITIAL_EMAIL` | Default administrator seed email address | Server Only | `admin@pureblend.com` |
| `ADMIN_INITIAL_PASSWORD`| Default administrator seed password for first-time migration seeding | Server Only | High-entropy string (e.g., `Admin_PureBlend!2026`) |

#### C. AI & RAG Subsystem
| Variable Name | Purpose | Scope | Format / Example |
|---|---|---|---|
| `OPENAI_API_KEY` | OpenAI API key for `text-embedding-3-small` (1536-dim) and `gpt-4o-mini` | Server Only | `sk-proj-...` |
| `RAG_SIMILARITY_THRESHOLD` | Minimum cosine similarity score required for grounding before triggering refusal | Server Only | `0.70` (default: 0.70) |

#### D. SMTP Email Dispatch (Contact Form)
| Variable Name | Purpose | Scope | Format / Example |
|---|---|---|---|
| `SMTP_HOST` | Hostname of SMTP mail relay | Server Only | `smtp.resend.com` or `smtp.sendgrid.net` |
| `SMTP_PORT` | SMTP port | Server Only | `587` (STARTTLS) or `465` (SSL) |
| `SMTP_USER` | Authenticated SMTP username | Server Only | `apikey` or `pureblend-mailer` |
| `SMTP_PASSWORD` | Authenticated SMTP password or secret API key | Server Only | Strong alphanumeric token |
| `SMTP_FROM` | Sender address shown in outbound email envelope | Server Only | `"PureBlend Inquiries" <no-reply@pureblend.example.com>` |
| `CONTACT_RECIPIENT` | Business inbox receiving customer inquiries and sample requests | Server Only | `orders@pureblend.example.com` |

#### E. Cloud Media Storage (Cloudinary / Supabase Storage)
| Variable Name | Purpose | Scope | Format / Example |
|---|---|---|---|
| `STORAGE_PROVIDER` | Object storage provider selector (`cloudinary` or `supabase`) | Server Only | `cloudinary` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account identifier | Server Only | `pureblend-media` |
| `CLOUDINARY_API_KEY` | Cloudinary access key | Server Only | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary secret access token | Server Only | Alphanumeric secret |

---

## 3. Environment Strategy Across Stages

### 3.1. Local Development (`.env.development` & `.env.local`)
- `.env.development`: Tracked in Git with `NEXT_PUBLIC_USE_MOCK_DATA=true` and empty base URL for safe out-of-the-box frontend development.
- `.env.local`: Untracked file created by each developer with local PostgreSQL and test SMTP configurations:
  ```bash
  cp .env.example .env.local
  ```

### 3.2. Staging & Production Deployment
- Deployed on Vercel / Cloud Container.
- Environment variables configured via provider dashboard (Vercel Project Settings &rarr; Environment Variables).
- Production forces:
  - `NEXT_PUBLIC_USE_MOCK_DATA=false`
  - Valid `DATABASE_URL` with SSL mode enabled.
  - Valid `AUTH_SECRET` generated via `openssl rand -hex 32`.
  - Active `OPENAI_API_KEY` and `SMTP_*` credentials.

---

## 4. Server-Side Environment Validator (`src/lib/server/env.ts`)

To ensure fail-fast safety, the backend implements a runtime schema validation utility using Zod that validates critical environment variables whenever server route handlers boot:

```typescript
import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  OPENAI_API_KEY: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  CONTACT_RECIPIENT: z.string().email().optional(),
});

export const serverEnv = serverEnvSchema.parse(process.env);
```
