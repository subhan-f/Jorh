# Phase 3 — Scale & Ecosystem (Months 4–6)

## Goal

Make Jorh a platform, not just a tool. Ship the public API, team workspaces, social link generators suite, A/B testing, browser extension, and deeper integrations. This is when Jorh graduates from "cool tool" to "must-have workspace."

**Target MRR at end:** $5,000  
**Target API calls/month:** 100,000

---

## Deliverables

### 1. Public REST API (Business Plan)

The biggest lever for developer adoption and Business plan upgrades.

**Base URL:** `api.jorh.net/v1`

**Authentication:** Bearer token (API keys managed in dashboard)

**Endpoints:**
```
# Links
GET    /v1/links              — list links (cursor-paginated)
POST   /v1/links              — create link
GET    /v1/links/:id          — get link
PATCH  /v1/links/:id          — update link
DELETE /v1/links/:id          — delete link
GET    /v1/links/:id/clicks   — get click analytics

# QR Codes
POST   /v1/qr                 — generate QR code (returns PNG/SVG URL)

# Bio Pages
GET    /v1/bio-pages          — list bio pages
PATCH  /v1/bio-pages/:id      — update bio page

# Workspaces
GET    /v1/workspaces         — list workspaces user belongs to
GET    /v1/workspaces/:id/links — list workspace links

# Utilities
POST   /v1/tools/shorten      — alias for POST /v1/links
POST   /v1/tools/utm          — build a UTM URL
GET    /v1/tools/og-preview   — fetch OG metadata for a URL
GET    /v1/tools/redirect-chain — trace redirect chain
```

**API Key management:**
- Dashboard: `Settings > API Keys` → generate named keys
- Keys stored hashed in Firestore (never shown after creation)
- Scopes: `read`, `write`, `analytics`, `admin`
- Rate limits: 1,000 req/hour (Business), 10,000 req/hour (Enterprise)

**API Documentation:**
- Auto-generated with `@hono/swagger-ui` + OpenAPI spec
- Hosted at `api.jorh.net/docs`
- Code examples in JS, Python, cURL, PHP

---

### 2. Team Workspaces (Business Plan)

Allow teams to share a link library, collaborate on bio pages, and share analytics.

**Workspace model:**
- One workspace per Business/Enterprise subscription
- Members: Admin (full control), Editor (create/edit), Viewer (read + copy)
- Shared link namespace — all team links visible to all members
- Shared custom domains
- Per-member activity audit log

**UI — `/workspaces`:**
- Workspace switcher in sidebar (like Slack)
- Member management: invite by email, set role, remove
- Shared links table with "Created by" column
- Workspace settings: name, logo, custom domain

**Invite flow:**
1. Admin enters email → Resend sends invite email
2. Invitee clicks link → lands on `/accept-invite?token=` → creates account or logs in → added to workspace
3. Token is single-use, expires in 48 hours

---

### 3. Social Platform Link Generator Suite

Expand the WhatsApp generator into a full suite of social deep link tools. Each is a standalone SEO page on the marketing site and a saved tool in the dashboard.

**Generators to ship:**

| Tool | Output | SEO Target Keyword |
|---|---|---|
| WhatsApp | `wa.me/...` | "whatsapp link generator" |
| Telegram | `t.me/...` | "telegram link generator" |
| Twitter/X Intent | `twitter.com/intent/tweet` | "tweet intent link" |
| LinkedIn Share | `linkedin.com/sharing/share-offsite` | "linkedin share link" |
| Facebook Share | `facebook.com/sharer/sharer.php` | "facebook share link generator" |
| Email (mailto) | `mailto:?subject=&body=` | "mailto link generator" |
| SMS | `sms:?body=` | "sms link generator" |
| YouTube Timestamp | `youtube.com/watch?v=...&t=` | "youtube timestamp link" |
| Zoom Meeting | Deep link + web fallback | "zoom link generator" |
| Google Maps | `maps.google.com/?q=` | "google maps link generator" |
| App Store / Play | Direct + web fallback | "app download link generator" |
| Discord Invite | `discord.gg/` formatter | "discord invite link" |

**Shared architecture:**
- `packages/utils/social-links.ts` — pure functions for each generator
- Dashboard: all generators in `/tools` section with saved history
- Marketing: `/tools/[generator-name]` static page with embedded interactive tool (Astro island)

---

### 4. Link Rotator

A single short URL that round-robins traffic across multiple destinations.

**Use cases:**
- A/B testing landing pages
- Rotating affiliate offers
- Load distribution across mirrors

**How it works:**
- User creates a "Rotator" link with N destination URLs + weight per URL
- Cloudflare Worker reads rotator config from KV, picks destination using weighted random
- Analytics tracked per destination

**UI — Create rotator:**
- Add up to 10 destination URLs
- Set weight (%) per URL
- View per-destination analytics

---

### 5. A/B Testing for Links

Extension of the rotator — but specifically for bio page buttons and short link destinations.

**Variants:**
- Split traffic 50/50 (or custom) between two destination URLs
- Dashboard shows which variant wins by CTR
- "Declare winner" button — stops split, 100% to winner

---

### 6. Webhook Support (Business Plan)

Fire HTTP callbacks on link events so users can build automations.

**Events:**
- `link.clicked` — fires on every redirect
- `link.expired` — fires when link expires
- `link.created` — fires on link creation

**Implementation:**
- User registers webhook URL + secret in dashboard
- API uses Cloudflare Queue (or BullMQ) to enqueue webhook deliveries
- HMAC-SHA256 signature on each payload (verified with user's secret)
- Retry: 3 attempts with exponential backoff
- Delivery log in dashboard

---

### 7. Redirect Chain Analyzer

**What it does:**
- Input any URL → trace all HTTP redirects step-by-step
- Show: status code, redirect-to URL, response time per hop
- Flag: redirect loops, too many hops (>5), HTTP→HTTPS downgrades

**Implementation:**
- API endpoint `GET /tools/redirect-chain?url=` — server-side fetch, follows redirects manually
- Capped at 10 hops to prevent infinite loops

**Marketing page:** `/tools/redirect-chain-analyzer` — target keyword "redirect chain checker"

---

### 8. Link Health Monitor

For users with many links — detect broken/dead links automatically.

**How it works:**
- Background job (Cloudflare Cron Trigger) runs daily
- Checks all active links with a HEAD request to their destination URL
- Marks links where destination returns 4xx/5xx as "broken"
- Sends email digest (Resend) to user listing broken links

**Dashboard UI:**
- "Link Health" tab in `/links`
- Filter: All | Healthy | Broken | Unchecked
- "Re-check now" button per link

---

### 9. Browser Extension

A Chrome/Firefox extension that lets users shorten the current page URL in one click.

**Features:**
- Click extension icon → shorten current tab URL instantly
- Copy to clipboard
- View last 10 shortened links
- Create QR for current page

**Tech:** Plasmo framework (React + TypeScript, builds for Chrome/Firefox/Edge)

**Distribution:** Chrome Web Store, Firefox Add-ons, Edge Add-ons

---

### 10. Zapier + Make Integration

Expose Jorh as a Zapier app so non-developers can automate link creation.

**Zapier triggers:**
- New link created
- Link clicked (digest — not per-click)

**Zapier actions:**
- Create short link
- Create QR code
- Add button to bio page

**Implementation:** Zapier CLI + Jorh REST API as the backend

---

### 11. Branded / Custom QR Codes (Pro+)

Allow users to overlay a logo on their QR codes.

- Upload logo image → stored in Firebase Storage
- API composites logo onto center of QR (using `sharp`)
- Custom colors, border radius, frame style
- Download as PNG, SVG, or PDF

---

### 12. Bulk Operations

For power users managing hundreds of links.

- **Bulk shorten via CSV upload** — Upload CSV of URLs → download CSV with short links
- **Bulk delete** — Select + delete multiple links
- **Bulk export** — Export all links + analytics as CSV

---

## Analytics Infrastructure Upgrade

At Phase 3 scale (millions of clicks), Firestore aggregation queries become expensive. Migrate analytics writes to a dedicated store:

**Option A (recommended for early Phase 3):** Write clicks to Firestore + stream to BigQuery via Firebase extension → query BigQuery for analytics.

**Option B (Phase 4):** Self-host ClickHouse for sub-second analytics queries at any scale.

---

## Definition of Done (Phase 3)

- [ ] Public API live at `api.jorh.net/v1` with OpenAPI docs
- [ ] API keys: create, list, revoke from dashboard
- [ ] Team workspaces: invite, roles, shared links functional
- [ ] All 12 social platform generators live on marketing site
- [ ] Link rotator functional with per-destination analytics
- [ ] Webhooks: register, fire, retry, delivery log
- [ ] Redirect chain analyzer live
- [ ] Link health monitor running daily (Cloudflare Cron)
- [ ] Browser extension published to Chrome Web Store
- [ ] Zapier integration live with ≥2 triggers and ≥2 actions
- [ ] Branded QR with logo overlay functional
- [ ] Bulk CSV import/export functional
- [ ] Analytics queries migrated to BigQuery
