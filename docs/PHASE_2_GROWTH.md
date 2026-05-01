# Phase 2 — Growth & Monetization (Months 2–3)

## Goal

Turn Jorh from a working product into a **revenue-generating business**. Activate Stripe billing, ship the bio link page builder (the biggest retention driver), unlock advanced analytics, and add custom domain support. End of Phase 2: first paying customers.

**Target MRR at end:** $500  
**Target MAU at end:** 2,000

---

## Deliverables

### 1. Stripe Billing Integration

**Plans to activate:**
| Plan | Price | Key Limits |
|---|---|---|
| Free | $0 | 50 links, 1 bio page, 30-day analytics |
| Pro | $9/month or $90/year | Unlimited links, 3 custom domains, 1-year analytics, custom slugs |
| Business | $29/month or $290/year | 5 team seats, API access, white-label QR, branded domains |

**Implementation:**
- Stripe Products + Prices created via Stripe CLI / dashboard
- `POST /billing/create-checkout` → Stripe Checkout session
- `POST /billing/portal` → Stripe Customer Portal (manage/cancel)
- Stripe webhook: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- Webhook handler updates Firestore `users/{id}.plan` field
- `<PlanGate plan="pro">` component gates UI features with upgrade prompt
- Yearly billing offered at 2 months free (17% discount)

**Firestore billing fields:**
```typescript
interface User {
  plan: 'free' | 'pro' | 'business' | 'enterprise';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus?: 'active' | 'past_due' | 'canceled';
  subscriptionEndsAt?: Timestamp;
}
```

---

### 2. Bio Link Page Builder (Linktree Competitor)

The highest-value feature for creator/influencer segment.

**What users get:**
- A public page at `jorh.net/bio/[username]` or `[custom-domain]/`
- Profile: avatar, name, headline, social icons
- Buttons: unlimited links with icon, label, and URL
- Themes: 10+ preset themes + custom colors
- Analytics: per-button click tracking

**Builder UI — `/bio/edit`:**
- Live preview pane (mobile viewport simulation) + editor pane
- Drag-and-drop button reordering (via `@dnd-kit/core`)
- Button types: Link, Email, Phone, WhatsApp, Social Profile
- Theme picker: gradient backgrounds, solid, glassmorphism cards
- Typography controls: font family, size
- Toggle: show/hide individual buttons
- Custom avatar upload → Firebase Storage

**Public page — `jorh.net/bio/[username]`:**
- Rendered by Astro (SSR mode) for SEO + fast load
- Framer Motion stagger animations on button entrance
- Each button click triggers analytics event → API
- Mobile-first design

**Firestore schema:**
```typescript
interface BioPage {
  id: string;
  ownerId: string;
  slug: string;            // jorh.net/bio/[slug]
  customDomain?: string;   // Pro+
  title: string;
  description?: string;
  avatarUrl?: string;
  theme: BioTheme;
  buttons: BioButton[];
  socialLinks: SocialLink[];
  isPublished: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface BioButton {
  id: string;
  label: string;
  url: string;
  icon?: string;           // icon name from Lucide
  isActive: boolean;
  order: number;
  clicks: number;          // denormalized for fast display
}
```

---

### 3. Advanced Analytics Dashboard

**Per-link analytics page `/links/:id/analytics`:**
- **Clicks over time** — Line chart (1D / 7D / 30D / 90D / custom)
- **Top countries** — Choropleth map or bar chart
- **Device breakdown** — Mobile / Desktop / Tablet donut chart
- **Browser breakdown** — Chrome, Safari, Firefox, etc.
- **OS breakdown** — iOS, Android, Windows, macOS, Linux
- **Top referrers** — Where traffic comes from
- **Best hours** — Heatmap of clicks by hour/day-of-week

**Dashboard overview `/dashboard`:**
- Total clicks (all time, this month)
- Top 5 performing links
- Clicks trend sparklines
- Link type breakdown

**Charts library:** Recharts (lightweight, composable, works with Tailwind)

**Analytics data pipeline:**
- Clicks written to Firestore `/clicks` collection by Cloudflare Worker
- API aggregates on read (acceptable at Phase 2 scale)
- Phase 3: move to BigQuery or ClickHouse for scale

**Data retention by plan:**
| Plan | Retention |
|---|---|
| Free | 30 days |
| Pro | 1 year |
| Business | 3 years |
| Enterprise | Unlimited |

---

### 4. UTM Builder

**What it does:**
- Construct UTM-tagged URLs: `?utm_source=&utm_medium=&utm_campaign=&utm_term=&utm_content=`
- Save UTM templates (e.g., "Email Newsletter template")
- One-click shorten the UTM URL via Jorh

**UI — `/tools/utm-builder`:**
- Base URL input
- 5 UTM parameter fields with descriptions/examples
- Live preview of final URL
- "Copy URL" + "Shorten with Jorh" CTA
- Saved templates (logged-in users)

**Marketing site page:** SEO-optimized landing at `/tools/utm-builder` — target keyword "UTM builder", "UTM link generator"

---

### 5. Custom Domain Support (Pro)

Allow Pro users to use their own domain as a short domain (e.g., `go.mybrand.com`).

**How it works:**
1. User enters domain in dashboard settings
2. Jorh shows DNS instructions: add CNAME `go.mybrand.com → go.jorh.net`
3. User verifies DNS propagation via API check
4. Cloudflare Worker handles incoming requests from custom domains (via Cloudflare custom hostnames)
5. Worker looks up which workspace/user owns the domain → resolves links in their namespace

**Cloudflare Custom Hostnames:**
- Uses Cloudflare's "Custom Hostnames" feature (via API) to SSL-terminate and route custom domains
- No infrastructure change needed — Cloudflare handles cert provisioning automatically

---

### 6. Password-Protected Links

- Link creator sets a password when creating/editing a link
- Cloudflare Worker detects `password` field → serves a minimal HTML password page
- User submits password → Worker validates (bcrypt hash stored in KV) → sets a session cookie → redirects

---

### 7. Link Expiry (Click Limit + Date)

- Options on link edit: "Expire after N clicks" or "Expire at [date/time]"
- Worker checks expiry before redirect → returns 410 Gone page if expired
- Dashboard shows expired links with status badge

---

### 8. Open Graph Preview Tool

**What it does:**
- Input any URL → fetch its OG meta tags (title, description, image)
- Preview how it will look when shared on Twitter, LinkedIn, Facebook, WhatsApp
- Option to shorten the URL

**Implementation:**
- API route `GET /tools/og-preview?url=` fetches and parses OG tags server-side (avoids CORS)
- Uses `open-graph-scraper` npm package

**Marketing page:** `/tools/og-preview` — target keyword "open graph preview", "link preview checker"

---

### 9. Email Onboarding (Resend)

Triggered email sequences:
- **Welcome email** — On signup: introduce tools, link to docs
- **First link created** — Tips for sharing, analytics overview
- **Upgrade nudge** — When user hits 80% of free tier limit
- **Inactive user** — 7 days no login: "Here's what's new"

Template engine: React Email (`.tsx` templates, rendered server-side with Resend)

---

## Phase 2 Feature Flags

Use PostHog feature flags to control rollout:

| Flag | Rollout | Purpose |
|---|---|---|
| `bio-page-builder` | 100% | Bio pages (Phase 2 launch) |
| `stripe-billing` | 100% | Paywall features |
| `custom-domains` | Pro users | Beta custom domains |
| `og-preview` | 50% | A/B test conversion |

---

## Definition of Done (Phase 2)

- [ ] Stripe Checkout + webhooks functional
- [ ] Pro/Business plan gates enforced in UI and API
- [ ] Bio page builder ships with 10+ themes
- [ ] Public bio pages load in <1s (Lighthouse)
- [ ] Analytics dashboard shows all 7 chart types
- [ ] UTM builder live on marketing site
- [ ] Custom domain flow functional for ≥1 beta user
- [ ] Password-protected links work end-to-end
- [ ] Link expiry (date + click count) functional
- [ ] Resend email sequences active
- [ ] First paying customer acquired
