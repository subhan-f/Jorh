# Phase 1 — MVP Core (Weeks 1–6)

## Goal

Ship a working, publicly accessible product with the highest-value tools. Validate that users find Jorh useful enough to return. No enterprise features. No teams. Just rock-solid core tools with a beautiful UI.

**Ship date target:** Week 6 from project start.

---

## Deliverables

### 1. Monorepo Scaffold ✅

```
jorh/
├── apps/
│   ├── web/          # Astro 6 marketing site
│   ├── dashboard/    # React 19 + Vite dashboard
│   ├── api/          # Node.js 22 + Hono 4 API
│   └── redirect/     # Cloudflare Worker
├── packages/
│   ├── ui/
│   ├── types/        # has build script → dist/ for Node.js runtime
│   ├── utils/        # has build script → dist/ for Node.js runtime
│   ├── firebase/
│   └── config/
│       ├── tailwind/
│       ├── typescript/
│       └── eslint/
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

**Setup checklist:**
- [x] `pnpm init` at root, configure `pnpm-workspace.yaml`
- [x] Turborepo config with `build`, `dev`, `lint`, `typecheck` pipelines
- [x] Shared `tsconfig` in `packages/config/typescript` (base + node + react variants)
- [x] Shared Tailwind preset in `packages/config/tailwind`
- [x] Shared ESLint config in `packages/config/eslint`
- [x] Husky + lint-staged + commitlint
- [ ] GitHub Actions CI — using Google Cloud Build instead (see deploy section)
- [x] `.env.example` with all required vars documented
- [x] Zod env validation in each app at startup

---

### 2. Firebase Setup ✅

- [x] Firebase project created: `jorh-1` (single project — dev/prod share one project for now)
- [x] Firestore: enabled, rules locked down to API-only access
- [x] Firebase Auth: Email/password + Google OAuth enabled
- [x] Firebase Storage: bucket configured
- [x] `packages/firebase` package: typed Firestore helpers, auth helpers
- [ ] Separate `jorh-1-dev` Firebase project for development

**Actual Firestore Security Rules (API-only pattern):**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```
All reads/writes go through the API which uses the Firebase Admin SDK. Client SDKs in the dashboard/web are used for Auth only, not direct Firestore access.

---

### 3. Cloudflare Worker — Redirect Engine ✅

The most performance-critical piece. All short links must redirect in <50ms globally.

**Actual architecture:**
- Cloudflare Worker deployed to `go.jorh.net`
- Worker reads link data from Cloudflare KV only (no Firestore fallback — returns 404 on miss)
- On redirect, fires a non-blocking analytics write to the API via `ctx.waitUntil`
- Full password-protection flow (cookie-based, 1-hour session)
- Click-limit enforcement before redirect

**Actual Worker logic (simplified):**
```typescript
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const code = new URL(request.url).pathname.slice(1);
    const link = await env.LINKS_KV.get<StoredLink>(code, "json");

    if (!link) return errorPage(404, "Link not found", "...");
    if (!link.isActive) return errorPage(410, "Link inactive", "...");
    if (link.expiresAt && Date.now() > link.expiresAt) return errorPage(410, "Link expired", "...");
    if (link.clickLimit && link.clickCount >= link.clickLimit) return errorPage(410, "Limit reached", "...");
    if (link.password) { /* cookie-based password gate */ }

    ctx.waitUntil(recordClick(request, link.id, env));
    return Response.redirect(link.originalUrl, 302); // 302 temporary (not 301)
  }
}
```

**Deviations from original plan:**
- Uses **302** (temporary) not 301 (permanent) to allow future redirects to change without browser caching
- **No Firestore fallback** on KV miss — keeps the Worker pure edge with no external latency
- KV sync: API writes to KV on link create/update/delete via `src/lib/kv.ts`

---

### 4. API — Node.js + Hono ✅ (partial)

Current base URL: `https://jorh-api-599388754417.us-central1.run.app`
Target base URL: `https://api.jorh.net`

**Implemented routes:**
```
POST   /auth/verify               — Verify Firebase ID token, create/return user doc
GET    /auth/admin/users          — List all users (admin only)

GET    /links                     — List user's links (cursor-paginated)
POST   /links                     — Create link (shortener, QR, whatsapp types)
GET    /links/:id                 — Get single link
PATCH  /links/:id                 — Update link
DELETE /links/:id                 — Soft delete (sets isDeleted: true)
GET    /links/check-slug?slug=    — Check if custom slug is available (GET with query param)

POST   /analytics/click           — Record a click (called by Worker, X-Internal-Key auth)
GET    /analytics                 — Aggregated click stats (device/country/browser breakdown)

POST   /qr                        — Generate QR code (returns dataurl or SVG inline)

GET    /tools/shorten             — Anonymous URL shortener (no auth)
POST   /tools/whatsapp            — Build WhatsApp deep link
POST   /tools/tweet               — Build tweet intent link
POST   /tools/linkedin            — Build LinkedIn share link
POST   /tools/utm                 — Build UTM-tagged URL
POST   /tools/og-preview          — Scrape OG metadata for a URL

POST   /billing/checkout          — Stripe checkout session (stub)
POST   /billing/portal            — Stripe billing portal (stub)

GET    /health                    — Health check
```

**Not yet implemented (planned):**
```
GET    /links/:id/analytics       — Per-link click breakdown
GET    /user/profile              — Get authenticated user profile
PATCH  /user/profile              — Update display name / avatar
```

**Actual middleware stack:**
1. `logger()` — Hono request logger
2. `secureHeaders()` — Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
3. `cors({ origin: env.CORS_ORIGINS })` — origins from `CORS_ORIGINS` env var (pipe-separated)
4. Route-level `requireAuth` — Firebase ID token → user doc lookup
5. Route-level `requireRole` — admin/client RBAC
6. Zod body/query validation via `@hono/zod-validator`
7. `app.onError(errorMiddleware)` — global error handler

**Deviation from plan:** CORS does not hardcode `jorh.net`/`app.jorh.net`. It reads `CORS_ORIGINS` at runtime (pipe-separated list) to support both Cloud Run URLs and custom domains simultaneously.

**Response envelope:**
```typescript
type ApiResponse<T> = {
  data: T | null;
  error: { code: string; message: string } | null;
  meta?: Record<string, unknown>;
};
```

---

### 5. Tool 1: URL Shortener ✅ (backend done, dashboard UI partial)

**Backend:** fully implemented in `src/services/link.service.ts`
- 6-char base62 short code generation via `@jorh/utils`
- Collision check against Firestore + KV before saving
- KV sync on create/update/delete
- `customSlug` support with uniqueness validation

**Dashboard UI status:**
- [x] Links list page (`/client/links`) — shows all links with click counts
- [ ] Create link wizard (`/client/links/new`) — not yet built
- [ ] Edit link page (`/client/links/:id`) — not yet built
- [ ] Bulk select + delete
- [ ] Search and filter

---

### 6. Tool 2: QR Code Generator ✅ (backend done, dashboard UI stub)

**Backend:** implemented in `src/services/qr.service.ts` + `src/routes/qr.ts`
- `POST /qr` accepts `{ url, type: "dataurl"|"svg", color?, bgColor?, errorLevel? }`
- Returns inline QR (dataurl or SVG) — not stored in Firebase Storage in Phase 1
- Library: `qrcode` npm package

**Dashboard route:** `/client/tools/qr` (page exists, full CRUD UI pending)

**Deviation from plan:** QR codes are returned inline rather than uploaded to Firebase Storage. Storage upload is a Phase 2 enhancement (needed for QR analytics on scans).

---

### 7. Tool 3: WhatsApp Link Generator ✅ (backend done, dashboard UI stub)

**Backend:** `POST /tools/whatsapp` builds `wa.me` deep links
- Also available via `buildWhatsAppLink()` in `@jorh/utils` (client-side)

**Dashboard route:** `/client/tools/whatsapp` (page exists, full UI pending)

---

### 8. Marketing Site — Astro 6 ✅ (partial)

**Implemented pages:**
- [x] `/` — Hero, features, CTA
- [x] `/pricing` — Pricing tiers
- [x] `/tools/url-shortener` — SEO landing page
- [x] `/tools/qr-generator` — SEO landing page
- [x] `/tools/whatsapp` — SEO landing page + tool embed

**Not yet built:**
- [ ] `/blog` — Astro content collections stub
- [ ] `/login` — Auth redirect page
- [ ] OG image generation per page
- [ ] Dark mode toggle
- [ ] Testimonials section

---

### 9. Dashboard App — React 19 + Vite ✅ (core done, features partial)

**Actual route structure (role-prefixed):**
```
/login                       — Email/password + Google OAuth
/register                    — Sign up

/client/dashboard            — Overview stats, recent 5 links
/client/links                — All links table
/client/tools/qr             — QR codes page
/client/tools/whatsapp       — WhatsApp generator page
/client/analytics            — Analytics page
/client/settings             — Profile + plan settings

/admin/dashboard             — Admin overview
/admin/links                 — All links (admin view)
/admin/tools/qr              — QR (admin)
/admin/tools/whatsapp        — WhatsApp (admin)
/admin/analytics             — Analytics (admin)
/admin/settings              — Settings (admin)
```

`/` redirects to the correct dashboard path based on `user.role` via `getRoleDashboardPath()`.

**Implemented:**
- [x] Auth (Firebase email + Google OAuth), `useAuthInit` hook
- [x] Role-based routing guards (`RoleGuard`, `RoleHomeRedirect`)
- [x] Dashboard overview (stats cards, recent links)
- [x] Links list with `LinkCard` component
- [x] TanStack Query for all server state
- [x] Zustand auth store
- [x] `api.ts` fetch wrapper with Firebase token injection + 401 retry

**Not yet built:**
- [ ] Create link form / wizard
- [ ] Edit link form
- [ ] Analytics charts (page exists, charts need data wiring)
- [ ] Settings form (profile update, plan display)
- [ ] QR UI (page exists, generate UI needed)
- [ ] WhatsApp UI (page exists, form needed)

---

### 10. Auth Flow ✅

- Firebase Auth handles token issuance (email/password + Google OAuth)
- `useAuthInit()` hook subscribes to `onAuthChange` → calls `POST /auth/verify` on login
- API auto-creates user doc on first verify, assigns role from `ADMIN_EMAILS` env var
- `requireAuth` middleware on every protected API route
- Token stored in memory only (never localStorage) — refreshed automatically by Firebase SDK
- Protected routes redirect to `/login` if no Firebase user or no user doc

---

## Deployment ✅

All apps are deployed to **Google Cloud Run** via **Google Cloud Build**.

| Service | Dockerfile | Cloud Build YAML |
|---|---|---|
| API | `apps/api/Dockerfile` | `deploy/cloud-run/cloudbuild.api.yaml` |
| Dashboard | `apps/dashboard/Dockerfile` | `deploy/cloud-run/cloudbuild.dashboard.yaml` |
| Web | `apps/web/Dockerfile` | `deploy/cloud-run/cloudbuild.web.yaml` |

Deploy with: `bash deploy/cloud-run/deploy.sh <api|dashboard|web>`

**Build optimizations in place:**
- Docker layer caching via `:cache` tag in Artifact Registry
- `E2_HIGHCPU_8` machine type for faster compilation
- Multi-stage Dockerfiles — production images exclude devDependencies
- `pnpm deploy --legacy` for API creates a self-contained production bundle

---

## Week-by-Week Schedule

| Week | Focus | Status |
|---|---|---|
| 1 | Monorepo scaffold, Firebase setup, Cloudflare Worker base | ✅ Done |
| 2 | API foundation, redirect Worker complete, URL Shortener backend | ✅ Done |
| 3 | QR Generator, WhatsApp Generator, link analytics backend | ✅ Done |
| 4 | Dashboard app: auth, links table, create flow | ⚠️ Partial — auth + list done, create/edit forms pending |
| 5 | Marketing site (Astro), design system, tool landing pages | ⚠️ Partial — core pages done, blog + dark mode pending |
| 6 | QA, bug fixes, performance audit, deploy to production | 🔄 In progress |

---

## Definition of Done (Phase 1)

- [x] Short link redirects work (Cloudflare Worker + KV)
- [x] Users can register and log in (email + Google)
- [x] API is deployed and reachable
- [x] Dashboard is deployed and reachable
- [x] Dashboard shows click count per link
- [x] Marketing site is live with tool pages
- [x] All API inputs validated with Zod
- [x] CI/CD pipeline: Google Cloud Build deploy on push
- [ ] `go.jorh.net` custom domain mapped to Cloudflare Worker
- [ ] `app.jorh.net`, `api.jorh.net`, `jorh.net` custom domains mapped to Cloud Run
- [ ] Create link form in dashboard
- [ ] Edit link form in dashboard
- [ ] QR generator UI wired in dashboard
- [ ] WhatsApp generator UI wired in dashboard
- [ ] Analytics charts wired in dashboard
- [ ] Rate limiting on API
- [ ] Per-link analytics endpoint (`GET /links/:id/analytics`)
- [ ] User profile endpoints (`GET/PATCH /user/profile`)
- [ ] Lighthouse score ≥95 on all marketing pages
- [ ] Error tracking (Sentry) live in all apps
- [ ] GDPR: cookie banner, privacy policy page
- [ ] Separate Firebase dev project (`jorh-1-dev`)
- [ ] GitHub Actions CI for PR checks (lint + typecheck)
