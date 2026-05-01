# Phase 1 — MVP Core (Weeks 1–6)

## Goal

Ship a working, publicly accessible product with the highest-value tools. Validate that users find Jorh useful enough to return. No enterprise features. No teams. Just rock-solid core tools with a beautiful UI.

**Ship date target:** Week 6 from project start.

---

## Deliverables

### 1. Monorepo Scaffold (Week 1)

Set up the entire project infrastructure before writing any feature code.

```
jorh/
├── apps/
│   ├── web/          # Astro 4 marketing site
│   ├── dashboard/    # React 19 + Vite dashboard
│   ├── api/          # Node.js + Hono API
│   └── redirect/     # Cloudflare Worker
├── packages/
│   ├── ui/
│   ├── types/
│   ├── utils/
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
- [ ] `pnpm init` at root, configure `pnpm-workspace.yaml`
- [ ] Turborepo config with `build`, `dev`, `lint`, `test` pipelines
- [ ] Shared `tsconfig.base.json` in `packages/config/typescript`
- [ ] Shared Tailwind preset in `packages/config/tailwind`
- [ ] Shared ESLint config in `packages/config/eslint`
- [ ] Husky + lint-staged + commitlint
- [ ] GitHub Actions CI: lint → test → build on PR
- [ ] `.env.example` with all required vars documented
- [ ] Zod env validation in each app at startup

---

### 2. Firebase Setup (Week 1)

- [ ] Firebase project created: `jorh-net-prod` + `jorh-net-dev`
- [ ] Firestore: enable, set security rules (auth-gated by default)
- [ ] Firebase Auth: Email/password + Google OAuth enabled
- [ ] Firebase Storage: bucket created, rules set
- [ ] `packages/firebase` package: typed Firestore helpers, auth helpers
- [ ] Service account key in GitHub Secrets for CI

**Firestore Security Rules (Phase 1):**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /links/{linkId} {
      allow read: if resource.data.isActive == true && resource.data.isDeleted == false;
      allow write: if request.auth.uid == resource.data.ownerId;
    }
    match /clicks/{clickId} {
      allow create: if true; // public write for analytics
      allow read: if request.auth != null;
    }
  }
}
```

---

### 3. Cloudflare Worker — Redirect Engine (Week 1–2)

The most performance-critical piece. All short links must redirect in <50ms globally.

**Architecture:**
- Cloudflare Worker deployed to `go.jorh.net`
- Worker reads link data from Cloudflare KV (not Firestore — too slow at edge)
- On redirect, fires a non-blocking analytics write to the API
- Falls back to Firestore if KV miss (then warms KV)

**Worker logic:**
```typescript
// Pseudocode
export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const code = new URL(req.url).pathname.slice(1);
    
    const cached = await env.LINKS_KV.get(code, 'json');
    if (!cached) return new Response('Not found', { status: 404 });
    
    if (cached.password) return servePasswordPage(cached);
    if (cached.expiresAt && Date.now() > cached.expiresAt) {
      return new Response('Link expired', { status: 410 });
    }
    
    // fire-and-forget analytics
    ctx.waitUntil(recordClick(req, cached.linkId, env));
    
    return Response.redirect(cached.originalUrl, 301);
  }
}
```

**KV sync:** API writes to both Firestore and KV on link create/update/delete.

---

### 4. API — Node.js + Hono (Week 2)

Base URL: `api.jorh.net`

**Routes (Phase 1):**
```
POST   /auth/verify-token          — Verify Firebase ID token, return user
GET    /links                      — List user's links (paginated)
POST   /links                      — Create link (shortener, QR, whatsapp)
GET    /links/:id                  — Get single link
PATCH  /links/:id                  — Update link
DELETE /links/:id                  — Soft delete
GET    /links/:id/analytics        — Click stats for a link
POST   /qr/generate                — Generate QR code image (returns URL)
POST   /links/check-slug           — Check if custom slug is available
POST   /analytics/click            — Record a click (called by Worker)
GET    /user/profile               — Get authed user profile
PATCH  /user/profile               — Update profile
```

**Middleware stack:**
1. CORS (allow `jorh.net`, `app.jorh.net`)
2. Rate limiting (Hono middleware + Cloudflare header)
3. Firebase token verification
4. Zod body validation (per route)
5. Error handler → `{ error: { code, message } }`

**Response envelope:**
```typescript
type ApiResponse<T> = {
  data: T | null;
  error: { code: string; message: string } | null;
  meta?: { total?: number; page?: number; cursor?: string };
};
```

---

### 5. Tool 1: URL Shortener (Week 2–3)

**Core behavior:**
- Input: long URL
- Output: `jorh.net/XXXXXX` (6-char base62: `[A-Za-z0-9]`)
- Custom slug on free tier: up to 3 custom slugs, 6–30 chars, alphanumeric + dash
- Collision-safe: generate code → check KV → retry if taken

**UI — Dashboard page `/links/new`:**
- URL input with validation (must be valid URL)
- Toggle: auto-code vs custom slug
- Optional: title, tags
- Preview card: shows final short URL + copy button
- Created link appears in links table instantly

**UI — Links table `/links`:**
- Columns: Short URL | Original URL | Clicks | Created | Status
- Actions: Copy, Edit, QR, Delete
- Pagination, search, filter by status
- Bulk select + delete

---

### 6. Tool 2: QR Code Generator (Week 3)

**Core behavior:**
- Generate QR for any URL (not just Jorh links)
- Options: foreground color, background color, error correction level (L/M/Q/H)
- Download as PNG (default) or SVG
- Phase 1: no logo overlay (Phase 2 feature)
- Generated QR stored in Firebase Storage, URL saved to Firestore

**Library:** `qrcode` (npm) for generation on the API side.

**UI — Tool page `/tools/qr-generator`:**
- Available on marketing site (Astro) without login for anonymous use
- Anonymous: can generate + download, but not saved
- Logged-in: saved to dashboard, gets analytics on scans if linked to a Jorh short URL
- Live preview updates as user types

---

### 7. Tool 3: WhatsApp Link Generator (Week 3)

**Core behavior:**
- Input: phone number (with country code picker) + optional pre-filled message
- Output: `https://wa.me/[phone]?text=[encoded_message]`
- Option to also shorten the WhatsApp link via Jorh shortener

**UI — Tool page `/tools/whatsapp`:**
- Country code dropdown (searchable, flags)
- Phone number input with format validation
- Message textarea (optional, 4096 char limit)
- Live preview of generated link
- One-click copy + optional QR code generation
- "Also shorten this link" toggle (requires login)

---

### 8. Marketing Site — Astro (Week 4–5)

Pages:
- `/` — Hero, features overview, tool previews, pricing, testimonials (placeholder), CTA
- `/tools/url-shortener` — SEO landing page for URL shortener
- `/tools/qr-generator` — SEO landing page + embedded tool (island)
- `/tools/whatsapp-link-generator` — SEO landing page + embedded tool
- `/pricing` — Pricing tiers
- `/blog` — Empty for now, Astro content collections ready
- `/login` — Auth page (redirects to `app.jorh.net`)

**SEO strategy for Phase 1:**
- Each tool page is a standalone SEO asset targeting high-volume keywords
- Example: "free qr code generator", "whatsapp link generator", "url shortener"
- Astro generates fully static HTML — perfect Core Web Vitals scores
- OG images generated per page
- `sitemap.xml` auto-generated

**Design system:**
- Tailwind CSS v4
- shadcn/ui components
- Dark mode support (system preference + manual toggle)
- Framer Motion page transitions and micro-animations
- Font: Inter (body) + Cal Sans or Geist (headings)
- Color palette: primary indigo/violet gradient, neutral slate grays

---

### 9. Dashboard App — React + Vite (Week 4–5)

**Routes:**
```
/login             — Email/password + Google OAuth
/register          — Sign up
/dashboard         — Overview stats, recent links
/links             — All links table
/links/new         — Create link wizard
/links/:id         — Edit link
/tools/qr          — QR generator (saved)
/tools/whatsapp    — WhatsApp generator (saved)
/settings          — Profile, plan info
```

**State management:**
- TanStack Query for all server state (links, analytics, user)
- Zustand for UI state (sidebar open, theme)
- React Hook Form + Zod for all forms

**Key components:**
- `<Sidebar>` with nav, plan badge, user avatar
- `<LinkCard>` for link list
- `<AnalyticsMiniChart>` — sparkline for 7-day clicks
- `<CopyButton>` — copy-to-clipboard with toast feedback
- `<PlanGate>` — wraps Pro features with upgrade prompt

---

### 10. Auth Flow (Week 5)

- Firebase Auth handles token issuance
- Dashboard calls `POST /auth/verify-token` on login → API creates/updates Firestore user doc
- Token stored in memory (not localStorage) + refreshed via Firebase SDK
- Protected routes redirect to `/login` if no token

---

## Week-by-Week Schedule

| Week | Focus |
|---|---|
| 1 | Monorepo scaffold, Firebase setup, Cloudflare Worker base |
| 2 | API foundation, redirect Worker complete, URL Shortener backend |
| 3 | QR Generator, WhatsApp Generator, link analytics backend |
| 4 | Dashboard app: auth, links table, create flow |
| 5 | Marketing site (Astro), design system, tool landing pages |
| 6 | QA, bug fixes, performance audit, deploy to production |

---

## Definition of Done (Phase 1)

- [ ] `go.jorh.net` redirects short links in <50ms (Cloudflare Worker)
- [ ] Users can register, log in, create short links
- [ ] QR code generator works without login (anonymous)
- [ ] WhatsApp link generator works without login
- [ ] Dashboard shows click count per link
- [ ] Marketing site is live with SEO tool pages
- [ ] Lighthouse score ≥95 on all marketing pages
- [ ] All forms validated with Zod
- [ ] CI/CD pipeline green
- [ ] Error tracking (Sentry) live in all apps
- [ ] GDPR: cookie banner, privacy policy page
- [ ] No IP stored raw in analytics
