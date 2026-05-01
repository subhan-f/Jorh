# Jorh — Master Product Roadmap

## Vision

Jorh is the **all-in-one link intelligence platform** for creators, marketers, and developers. Instead of juggling Bitly for shortening, Linktree for bio pages, QR Code generators, and scattered UTM builders — users get a single workspace that handles everything, with unified analytics and a beautiful dashboard.

**North Star Metric:** Monthly Active Links (MAL) — the number of unique links that receive at least one click per month.

---

## Product Pillars

### 1. Create
Generate, shorten, and customize links across all formats.

### 2. Share
Bio pages, QR codes, embeds, and social-ready previews.

### 3. Analyze
Unified analytics across all link types — clicks, geography, device, referrer.

### 4. Automate
API access, webhooks, Zapier integrations, smart routing rules.

---

## Tools Roadmap (All Phases)

### Core Link Tools
- [x] **URL Shortener** — `jorh.net/abc123`
- [x] **Custom Slug** — `jorh.net/my-campaign`
- [x] **QR Code Generator** — PNG, SVG, with logo overlay
- [x] **WhatsApp Link Generator** — wa.me links with pre-filled message
- [x] **Bio/Link-in-Bio Page Builder** — Linktree competitor
- [ ] **UTM Builder** — Campaign parameter generator + saved templates
- [ ] **Link Rotator** — Round-robin across multiple destinations
- [ ] **Password-Protected Links** — Gate content behind a password
- [ ] **Expiring Links** — Set click limit or expiry date/time
- [ ] **Deep Link Generator** — iOS/Android app deep links with fallback

### Social Platform Generators
- [x] **WhatsApp** — Message + number
- [ ] **Telegram** — t.me username + message
- [ ] **Instagram** — Profile / story links
- [ ] **Twitter/X** — Tweet intent with pre-filled text
- [ ] **LinkedIn** — Share intent
- [ ] **Facebook** — Share dialog
- [ ] **Discord** — Server invite helpers
- [ ] **YouTube** — Timestamped video links
- [ ] **Zoom** — Meeting link generator
- [ ] **Google Meet** — Auto-create + share

### Developer Tools
- [ ] **API** — REST API for all tools (Pro+)
- [ ] **Webhook** — Fire HTTP callbacks on click events
- [ ] **Open Graph Preview** — Preview how a link looks when shared
- [ ] **Redirect Chain Analyzer** — Trace all redirects for a URL
- [ ] **Link Health Monitor** — Detect broken/dead links

### Analytics & Insights
- [ ] **Click Analytics** — Per-link graphs (time, geo, device, browser, referrer)
- [ ] **Campaign Dashboard** — Group links by UTM campaign
- [ ] **Bio Page Analytics** — Per-button CTR on bio pages
- [ ] **Heatmap** (Phase 4) — Click distribution on bio page
- [ ] **CSV Export** — Download analytics data

### Team & Workspace
- [ ] **Team Workspaces** — Shared link library
- [ ] **Role-based Access** — Admin, Editor, Viewer
- [ ] **Branded Domains** — Bring your own domain
- [ ] **White-label QR** — Remove Jorh branding

---

## Phase Overview

```
Phase 1 (Weeks 1–6)   — MVP: Ship the core, prove the concept
Phase 2 (Months 2–3)  — Analytics, bio pages, monetization live
Phase 3 (Months 4–6)  — Developer tools, teams, integrations
Phase 4 (Month 6+)    — Enterprise, white-label, platform API
```

---

## Competitive Landscape

| Feature | Jorh | Bitly | Linktree | QR.io |
|---|---|---|---|---|
| URL Shortener | ✅ | ✅ | ❌ | ❌ |
| Bio Pages | ✅ | ❌ | ✅ | ❌ |
| QR Codes | ✅ | Pro only | Add-on | ✅ |
| WhatsApp Links | ✅ | ❌ | ❌ | ❌ |
| UTM Builder | ✅ | ✅ | ❌ | ❌ |
| Link Analytics | ✅ | ✅ | ✅ | Limited |
| Custom Domains | ✅ | Pro+ | Pro+ | Pro+ |
| API | ✅ | Pro+ | ❌ | Limited |
| Free Tier | Generous | Limited | Limited | Limited |
| All-in-one | ✅ | ❌ | ❌ | ❌ |

**Our moat:** being the only platform that combines all tools + social link generators + developer API in one product with a generous free tier.

---

## Firestore Data Model (Canonical)

```
/users/{userId}
  - email, displayName, avatarUrl
  - plan: 'free' | 'pro' | 'business' | 'enterprise'
  - createdAt, updatedAt

/links/{linkId}
  - ownerId, workspaceId?
  - originalUrl, shortCode, customSlug?
  - title, description, tags[]
  - type: 'short' | 'bio' | 'qr' | 'whatsapp' | ...
  - password?, expiresAt?, clickLimit?
  - isActive, isDeleted
  - createdAt, updatedAt

/clicks/{clickId}
  - linkId, timestamp
  - country, city, region
  - device: 'mobile' | 'tablet' | 'desktop'
  - browser, os
  - referrer, utmSource, utmMedium, utmCampaign
  (no PII — IP is hashed, not stored)

/bioPages/{pageId}
  - ownerId, slug, customDomain?
  - title, description, avatarUrl
  - theme, backgroundColor, accentColor
  - buttons[]: { label, url, icon, isActive, order }
  - createdAt, updatedAt

/workspaces/{workspaceId}
  - name, ownerId
  - members[]: { userId, role }
  - plan, customDomains[]
  - createdAt

/qrCodes/{qrId}
  - linkId, ownerId
  - style: { fgColor, bgColor, logoUrl, errorLevel }
  - format: 'png' | 'svg'
  - downloadCount
  - createdAt
```

---

## Success Metrics by Phase

| Phase | Key Metric | Target |
|---|---|---|
| Phase 1 | Registered users | 500 |
| Phase 1 | Links created | 5,000 |
| Phase 2 | MRR | $500 |
| Phase 2 | MAU | 2,000 |
| Phase 3 | MRR | $5,000 |
| Phase 3 | API calls/month | 100,000 |
| Phase 4 | MRR | $20,000 |
| Phase 4 | Enterprise accounts | 10 |
