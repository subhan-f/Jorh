# Jorh — Monetization & Pricing Strategy

## Pricing Philosophy

1. **Generous free tier** — enough to be genuinely useful, enough to show the product's value.
2. **Natural upgrade triggers** — limits that make users *want* to upgrade, not feel locked out.
3. **Annual discount** — 2 months free (17% off) on annual to improve cash flow and reduce churn.
4. **Simple tiers** — 3 public tiers + enterprise. No confusing add-ons.

---

## Pricing Tiers

### Free — $0/month
**Target:** Individual users exploring the product, students, casual users.

| Feature | Limit |
|---|---|
| Short links | 50 active |
| Custom slugs | 3 |
| Bio pages | 1 |
| QR codes | 20/month |
| Analytics | 30-day retention |
| Domains | jorh.net only |
| Social generators | Unlimited (anonymous) |
| Team members | 0 |
| API | ❌ |
| Support | Community |

**Upgrade triggers:**
- Hit 80% of link limit → in-app upgrade banner
- Try to add a custom domain → upgrade prompt
- Try to view 90-day analytics → upgrade prompt

---

### Pro — $9/month or $90/year
**Target:** Creators, freelancers, solopreneurs.

| Feature | Limit |
|---|---|
| Short links | Unlimited |
| Custom slugs | Unlimited |
| Bio pages | 5 |
| QR codes | Unlimited + logo overlay |
| Analytics | 1-year retention |
| Custom domains | 3 domains |
| Team members | 0 (personal) |
| Password-protected links | ✅ |
| Expiring links | ✅ |
| Link health monitor | ✅ |
| API | ❌ |
| Support | Email |

**Stripe Price ID:** `STRIPE_PRO_PRICE_ID`

---

### Business — $29/month or $290/year
**Target:** Marketing teams, agencies, SMBs.

| Feature | Limit |
|---|---|
| Everything in Pro | ✅ |
| Bio pages | Unlimited |
| Analytics | 3-year retention |
| Custom domains | 10 domains |
| Team members | 5 seats |
| API access | 10,000 req/hour |
| Webhooks | ✅ |
| Bulk CSV import/export | ✅ |
| Link rotator / A/B | ✅ |
| Smart targeting (geo, device) | ✅ |
| Zapier integration | ✅ |
| Support | Priority email + chat |

**Stripe Price ID:** `STRIPE_BUSINESS_PRICE_ID`

---

### Enterprise — Custom
**Target:** Large organizations, agencies with white-label needs.

| Feature | Limit |
|---|---|
| Everything in Business | ✅ |
| Team members | Unlimited |
| API | Custom rate limits |
| Custom domains | Unlimited |
| SSO (SAML/OIDC) | ✅ |
| SCIM provisioning | ✅ |
| Audit logging | ✅ |
| White-label dashboard | ✅ |
| Custom data retention | Custom |
| SLA | 99.99% uptime |
| Support | Dedicated CSM + Slack |
| Billing | Invoice |

**Sales contact:** `/enterprise` page → Cal.com booking

---

## Revenue Model Breakdown

### Primary: Subscription (SaaS)
- Pro at $9/month → 1,000 users = $9,000 MRR
- Business at $29/month → 200 users = $5,800 MRR
- Enterprise at $299/month avg → 10 accounts = $2,990 MRR
- **Path to $20K MRR:** ~1,200 Pro + 200 Business + 10 Enterprise

### Secondary: Marketplace (Phase 4)
- Bio page themes: $5–$19 one-time (30% cut → $1.50–$5.70 per sale)
- QR templates: $3–$9 one-time
- High volume potential once marketplace has critical mass

### Tertiary: White-Label Reseller (Phase 4)
- $299/month base + $0.50 per active user
- Agency with 50 active clients: $299 + $25 = $324/month per agency
- Scalable without heavy support overhead

---

## Conversion Strategy

### Free → Pro Conversion Targets
- Industry benchmark: 2–5% free-to-paid for SaaS tools
- Jorh target: 4% (year 1), 6% (year 2) — achievable with strong upgrade nudges

### Key Conversion Moments
1. **Link #41 created** (80% of limit) → upgrade banner
2. **Analytics page > 30 days** → blur + upgrade CTA
3. **Custom domain input** → upgrade CTA
4. **Team invite attempt** → upgrade CTA
5. **API key page visit** → upgrade CTA
6. **QR logo overlay attempt** → upgrade CTA

### Annual Plan Incentive
- Show "$108/year vs $90/year — save $18" prominently
- Default toggle to "Annual" on pricing page (dark pattern? no — users prefer annual if they intend to stick)
- Annual plan reduces churn significantly (people don't cancel mid-year)

---

## Stripe Implementation Notes

### Products
```
Product: Jorh Pro
  Price: $9.00/month recurring (monthly)
  Price: $7.50/month recurring (annual, billed $90/year)

Product: Jorh Business
  Price: $29.00/month recurring (monthly)
  Price: $24.17/month recurring (annual, billed $290/year)
```

### Webhooks to handle
| Event | Action |
|---|---|
| `checkout.session.completed` | Activate plan, send welcome email |
| `customer.subscription.updated` | Update plan in Firestore |
| `customer.subscription.deleted` | Downgrade to Free |
| `invoice.payment_failed` | Send dunning email, show banner in app |
| `customer.subscription.trial_will_end` | Send trial ending email |

### Trial Strategy (Phase 2)
- No credit card trial: 14-day Pro trial for all new users
- Trial ends → auto-downgrade to Free (no surprise charges)
- Nudge at day 7 and day 12 of trial

---

## Lifetime Deal (LTD) Strategy (Optional — Phase 2)

Run a one-time LTD campaign on AppSumo or direct if organic traction warrants it.

**LTD terms:** $99 one-time → Pro for life (2 code stacks = Business for life)
- Raises capital without dilution
- Builds initial paying user base quickly
- **Risk:** LTD users are often high-support, low-upgrade. Cap at 500 units.
- AppSumo takes 30–70% depending on deal structure

**Recommendation:** Only run LTD after reaching $500 MRR organically to validate product-market fit first.

---

## Unit Economics Target

| Metric | Target (Year 1) |
|---|---|
| Blended ARPU | $12/month |
| Gross Margin | 85%+ (SaaS typical) |
| CAC (organic) | ~$0 |
| CAC (paid) | <$30 |
| LTV (Pro at 18mo avg) | $162 |
| LTV:CAC | >5:1 |
| Monthly Churn | <3% |

### Infrastructure Cost Estimates (Phase 1)
| Service | Cost |
|---|---|
| Firebase Spark → Blaze | Pay as you go (~$10–50/mo at early scale) |
| Cloudflare Workers | $5/month (10M requests included) |
| Cloudflare KV | $0.50/month per million reads |
| Vercel (web + dashboard) | $20/month (Pro plan) |
| Railway/Fly.io (API) | $10–20/month |
| Resend | $20/month (50K emails) |
| Sentry | Free tier initially |
| PostHog | Free tier (1M events/month) |
| **Total** | **~$70–120/month** |

Break-even: **10–14 Pro subscribers** covers all infrastructure costs. Extremely low overhead.
