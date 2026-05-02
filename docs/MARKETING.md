# Jorh — Go-To-Market Strategy

## Positioning

**For:** Creators, marketers, and developers who juggle multiple link tools.  
**Who need:** A single, beautiful workspace for everything link-related.  
**Unlike:** Bitly (just shortener), Linktree (just bio pages), scattered QR generators.  
**Jorh is:** The all-in-one link management platform that replaces 5 tools with one.

**One-liner:** "Shorten, share, and analyze every link — from one workspace."

---

## Target Segments

### Primary: Solo Creators & Influencers

- Instagram, TikTok, YouTube creators with 10K–1M followers
- **Pain:** Juggling Linktree + Bitly + a QR generator + UTM builder
- **Hook:** "Replace all your link tools with one. For free."
- **Channel:** Instagram/TikTok organic, YouTube tutorials

### Secondary: Digital Marketers & Growth Teams

- Marketing teams at SMBs, agencies, e-commerce brands
- **Pain:** No unified analytics across all their links; scattered campaign tracking
- **Hook:** "See every click, from every channel, in one dashboard."
- **Channel:** LinkedIn content, Product Hunt, Twitter/X, SEO

### Tertiary: Developers & Indie Hackers

- Developers who want a link tool API for their own products
- **Pain:** Building their own shortener from scratch is annoying
- **Hook:** "URL shortener API in 5 minutes. Generous free tier."
- **Channel:** Dev.to, Hacker News, GitHub, Reddit (r/webdev, r/SideProject)

---

## Acquisition Channels

### 1. SEO (Biggest Long-Term Lever)

Each tool is a standalone SEO landing page. These pages are essentially free, recurring traffic machines.

**Target keywords (Phase 1):**
| Page | Keyword | Monthly Searches |
|---|---|---|
| `/tools/url-shortener` | "free url shortener" | 90,500 |
| `/tools/qr-generator` | "qr code generator free" | 165,000 |
| `/tools/whatsapp-link-generator` | "whatsapp link generator" | 27,100 |
| `/tools/utm-builder` | "utm link builder" | 22,200 |
| `/tools/link-in-bio` | "link in bio free" | 14,800 |
| `/tools/og-preview` | "open graph preview" | 8,100 |

**Tactics:**

- Astro-rendered static pages → near-perfect Core Web Vitals
- Each tool page embeds a **working, functional tool** (not a screenshot)
- Anonymous use → creates an account mid-session naturally
- Blog: "How to create a WhatsApp link for your business" (long-tail content)
- Target 50+ informational keywords per tool

### 2. Product Hunt Launch

- Plan a coordinated launch: 1 week before end of Phase 1
- Build a "coming soon" email list on the marketing site (50+ signups before launch)
- Post in relevant communities (Indie Hackers, r/SideProject) the day before
- Offer a "Product Hunt exclusive" — 3 months Pro free for first 100 upvoters
- Aim for #1 Product of the Day

### 3. Twitter/X Organic

- Founder account (@jorh_net or personal brand)
- Build in public: tweet weekly milestones, user counts, revenue updates
- Before/after threads: "I replaced 5 link tools with 1. Here's how."
- Feature highlight threads: "5 things you can do with Jorh that Bitly can't"
- Engage in #buildinpublic hashtag

### 4. YouTube (Tutorial Content)

- "How to make a Linktree for free in 2025" (targets Linktree brand keyword)
- "Best URL shortener for Instagram"
- "How to create a WhatsApp link with pre-filled message"
- Tutorials naturally rank for low-competition how-to keywords

### 5. Reddit & Community Marketing

- r/socialmedia, r/marketing, r/webdev, r/SideProject, r/Entrepreneur
- Don't spam — answer questions where Jorh is genuinely the solution
- "I made a free link-in-bio builder. Roast it." style posts get traction

### 6. Referral Program (Phase 2)

- "Give 1 month Pro, Get 1 month Pro" — share a referral link
- Referral dashboard in account settings
- Bonus: refer 5 users → get Pro for 6 months free

### 7. Creator Partnerships (Phase 2–3)

- Reach out to micro-influencers (10K–100K followers) in the marketing/creator space
- Offer: 3 months Pro free + affiliate link (20% recurring commission)
- Target 20 active affiliates in the first 6 months

### 8. Dev Communities (Phase 3 — API Launch)

- Product Hunt for the API separately ("Jorh API" launch)
- Hacker News "Show HN: I built a link management API"
- Dev.to article: "How I built a scalable URL shortener with Cloudflare Workers"
- GitHub: release an open-source SDK for the Jorh API

---

## Retention Strategy

### Onboarding Flow

1. Sign up → auto-create first short link (from onboarding wizard)
2. Prompt to create bio page (highest retention action)
3. Email day 1: "Share your Jorh bio page"
4. Email day 7: If no links created → "Here's what you can do with Jorh"

### Key Activation Events (correlate with retention)

- ✅ First link shortened
- ✅ First QR downloaded
- ✅ Bio page published
- ✅ First custom slug created
- ✅ Analytics page viewed

Get users to 3+ activation events in the first 7 days = high retention probability.

### In-app Nudges

- Free tier usage bar: "You've used 38/50 links. Upgrade for unlimited."
- Feature discovery: "Did you know you can add a password to any link?"
- Weekly email digest: "Your links got 142 clicks this week"

---

## Content Marketing Topics

### Blog Posts (target these for organic traffic)

**How-to articles:**

- "How to create a WhatsApp link for your business"
- "How to track clicks on your Instagram bio link"
- "UTM parameters explained: the complete guide"
- "How to make a QR code for your restaurant menu"
- "Best link shorteners compared: Bitly vs Rebrandly vs Jorh"

**Use-case articles:**

- "10 ways creators use link-in-bio pages"
- "How to use UTM tracking for influencer campaigns"
- "QR codes for small businesses: a practical guide"

**Technical articles (for dev audience):**

- "How URL shorteners work (and how we built ours on Cloudflare Workers)"
- "Building a link analytics system with Firestore and ClickHouse"

---

## Launch Checklist (Phase 1 Ship)

- [ ] 50+ email list built before launch
- [ ] Product Hunt scheduled for Tuesday (highest traffic day)
- [ ] 5 Twitter threads drafted and scheduled
- [ ] "Made with Jorh" badge on public bio pages (opt-out on Pro)
- [ ] Demo video (90 seconds) for Product Hunt
- [ ] Press kit: logo, screenshots, founder bio
- [ ] Launch day Slack/Discord community set up for early users
- [ ] Feedback form linked from dashboard (Tally.so or Formbricks)

---

## Metrics to Track Weekly

| Metric                 | Tool                       |
| ---------------------- | -------------------------- |
| Signups                | PostHog + Firebase Auth    |
| Links created          | Firestore                  |
| Active users (DAU/MAU) | PostHog                    |
| MRR                    | Stripe Dashboard           |
| Conversion: Free → Pro | Stripe                     |
| Churn rate             | Stripe                     |
| Organic traffic        | Google Search Console      |
| Keyword rankings       | Ahrefs / Semrush           |
| NPS                    | in-app survey (Formbricks) |
