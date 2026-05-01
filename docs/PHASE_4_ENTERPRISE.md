# Phase 4 — Enterprise & Platform (Month 6+)

## Goal

Position Jorh as the enterprise link intelligence platform. Unlock high-ACV contracts, white-label capability, and advanced targeting/personalization features that no link shortener currently offers at this level.

**Target MRR at end:** $20,000  
**Target Enterprise accounts:** 10

---

## Deliverables

### 1. Enterprise Plan & Sales Motion

**Enterprise plan features:**
- Unlimited everything (links, workspaces, domains, team members)
- Custom SLA (99.99% uptime guarantee)
- Dedicated support channel (Slack Connect)
- SSO via SAML 2.0 / OIDC
- Advanced audit logging (every action, who, when)
- Custom data retention policy
- Invoice billing (no credit card required)
- Custom contract + DPA (Data Processing Agreement)

**Sales motion:**
- `jorh.net/enterprise` landing page with case studies
- "Talk to sales" CTA → Cal.com booking page
- POC environment provisioned per prospect
- 14-day free Enterprise trial

---

### 2. SAML / SSO (Enterprise)

Allow enterprise customers to use their existing IdP (Okta, Azure AD, Google Workspace, etc.) for authentication.

**Implementation:**
- Use `samlify` or `@boxyhq/saml-jackson` library
- SAML metadata configuration per organization
- JIT provisioning: user auto-created on first SSO login
- SCIM provisioning: sync users/groups from IdP automatically

**SCIM endpoints:**
```
GET/POST   /scim/v2/Users
GET/PUT    /scim/v2/Users/:id
DELETE     /scim/v2/Users/:id
GET/POST   /scim/v2/Groups
```

---

### 3. Advanced Smart Targeting / Conditional Redirects

Allow a single short link to redirect to different destinations based on rules — without touching any code.

**Rule types:**
| Rule | Description |
|---|---|
| **Geo targeting** | Redirect to different URL per country/region |
| **Device targeting** | Different URL for mobile vs desktop |
| **OS targeting** | iOS → App Store, Android → Play Store, else → web |
| **Language targeting** | Browser language → localized landing page |
| **Time-based** | Different URL by hour-of-day or day-of-week |
| **UTM-based** | Different destination based on incoming UTM params |
| **A/B weighted** | Split traffic by percentage |

**Use case example:**
```
jorh.net/myapp
  → iOS users → apps.apple.com/myapp
  → Android users → play.google.com/myapp
  → Desktop (US) → myapp.com/en
  → Desktop (DE) → myapp.com/de
  → Fallback → myapp.com
```

**Implementation:**
- Rule set stored in KV alongside link data
- Cloudflare Worker evaluates rules client-side (no origin hit needed)
- Country/region from Cloudflare's `cf.country` header
- Device from User-Agent (fast regex, no UA-parser library)
- Rule editor: visual drag-drop priority ordering

---

### 4. White-Label Platform

Allow agencies and resellers to offer Jorh under their own brand.

**What white-label includes:**
- Custom domain for dashboard: `links.clientbrand.com`
- Client's logo, colors, typography throughout UI
- Custom email sender domain (`noreply@clientbrand.com`)
- Removed Jorh branding (footers, emails, OG images)
- Client's own Stripe account (revenue share model) OR Jorh billing (reseller margin)
- Sub-workspace structure: agency → clients

**Technical approach:**
- Tenant config stored in Firestore `/tenants/{tenantId}`
- Dashboard reads tenant config via subdomain detection at load time
- CSS variables injected at runtime for color theming
- Cloudflare handles SSL for white-label domains

**Pricing:** $299/month base + $0.50 per active user/month

---

### 5. Advanced Audit Logging

Enterprise customers need to know who did what and when.

**Logged events:**
- Login / logout / failed login
- Link created / updated / deleted
- Member invited / removed / role changed
- API key created / revoked
- Custom domain added / removed
- Billing changes

**Storage:** Separate Firestore collection `/audit_logs/{orgId}/{logId}` with 3-year retention.

**UI:** `Settings > Audit Log` — filterable by user, date range, action type. CSV export.

---

### 6. Advanced Bio Page Features

Take the bio page builder to professional-grade:

**New features:**
- **Video background** — Embed YouTube/video as page background
- **Countdown timer block** — "Product launch in 3 days"
- **Email capture block** — Collect emails directly on bio page (Mailchimp/Klaviyo integration)
- **Product block** — Show product image + price + "Buy now" CTA
- **Testimonial block** — Rotating quote cards
- **Schedule block** — "Book a call" via Cal.com embed
- **Analytics heatmap** — See where on your bio page users tap

---

### 7. Advanced Analytics — ClickHouse Migration

Move click analytics writes from Firestore to ClickHouse for sub-second queries at billions of rows.

**Architecture:**
```
Cloudflare Worker (click event)
  → Cloudflare Queue
    → API consumer
      → ClickHouse (write)
      → Firestore (denormalized counts only)
```

**ClickHouse schema:**
```sql
CREATE TABLE clicks (
  link_id    String,
  workspace_id String,
  ts         DateTime,
  country    LowCardinality(String),
  city       String,
  device     LowCardinality(String),
  browser    LowCardinality(String),
  os         LowCardinality(String),
  referrer   String,
  utm_source LowCardinality(String),
  utm_medium LowCardinality(String),
  utm_campaign String
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(ts)
ORDER BY (link_id, ts);
```

**Analytics API:** `GET /v1/links/:id/analytics?from=&to=&granularity=hour|day|week`

---

### 8. Link Intelligence Reports (AI-Powered)

Weekly/monthly auto-generated reports with AI analysis of link performance.

**Report includes:**
- Top performing links + why they performed well (day/time patterns)
- Traffic source breakdown + recommendations
- Broken link alerts
- "Your best performing campaign" highlight
- Growth vs previous period

**Implementation:**
- Scheduled Cloudflare Cron job → generates report data → passes to Claude API (Anthropic)
- Claude writes the narrative analysis section
- Report delivered via email (Resend) and available in dashboard

---

### 9. Embeddable Widgets

Let users embed Jorh tools on their own website.

**Widget types:**
- QR code widget: embed a live-updating QR for any URL
- Bio page widget: embed a mini bio page as a sidebar widget
- Link analytics badge: public "X clicks" badge for a link

**Implementation:**
- `/embed/qr?url=&size=200` → returns an `<iframe>`-safe HTML page
- `/embed/badge/:linkId` → returns an SVG with click count
- Both served from the Astro site as static routes with CDN caching

---

### 10. Platform Marketplace (Phase 4 End Goal)

Open Jorh to third-party tool developers — let the ecosystem build on top of Jorh.

**Marketplace items:**
- Custom bio page themes (by designers)
- QR code templates (by designers)
- Integration plugins (by developers)
- Custom analytics widgets

**Revenue model:** 30% platform cut on paid marketplace items.

**Implementation:** Phase 4 stretch goal — requires plugin API, sandboxed iframe rendering, and a review process.

---

## Definition of Done (Phase 4)

- [ ] Enterprise plan page live at `/enterprise`
- [ ] SAML SSO functional with Okta + Azure AD tested
- [ ] SCIM provisioning functional
- [ ] Smart targeting (geo, device, OS, time) functional in Worker
- [ ] Rule editor UI ships with drag-drop priorities
- [ ] White-label: one reference customer deployed on their own domain
- [ ] Audit log: all events captured, UI + CSV export functional
- [ ] 5 advanced bio page blocks (video, email capture, countdown, product, testimonial)
- [ ] ClickHouse migration complete, analytics queries <100ms at 1B+ rows
- [ ] AI-powered weekly reports email delivered to ≥10% of users
- [ ] Embeddable QR and badge widgets live
- [ ] 10 Enterprise accounts signed
