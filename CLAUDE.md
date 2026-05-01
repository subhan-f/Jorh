# Jorh — Claude Context

## Project Identity

**Name:** Jorh
**Meaning:** "Jorh" (جوڑ) is an Urdu word meaning *link*, *bond*, or *connection*.
**Tagline:** "Every link, beautifully managed."
**Domain:** jorh.net
**Type:** SaaS — Link Management & Micro-tool Platform

## What We're Building

Jorh is a production-grade, multi-tool link management SaaS platform. It gives individuals, creators, and businesses a unified workspace to shorten URLs, build bio link pages, generate QR codes, create social media deep links, and analyze every click — all under one roof with a polished, modern UI.

The goal is to compete with Bitly, Linktree, and QRCode generators by offering **all tools in one place** with a generous free tier and a clear upgrade path to paid plans.

---

## Monorepo Architecture

```
jorh/
├── apps/
│   ├── web/          # Astro — marketing site, landing page, tool pages (SEO)
│   ├── dashboard/    # React + Vite — authenticated user dashboard
│   ├── api/          # Node.js + Hono — REST API
│   └── redirect/     # Cloudflare Workers — edge-level link redirect service
├── packages/
│   ├── ui/           # Shared component library (shadcn/ui + custom)
│   ├── types/        # Shared TypeScript types and interfaces
│   ├── utils/        # Shared pure utility functions
│   ├── firebase/     # Firebase SDK wrapper (auth, firestore, storage)
│   ├── analytics/    # Analytics event tracking abstraction
│   └── config/       # Shared configs: tailwind, tsconfig, eslint, prettier
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
└── .env.example
```

---

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Monorepo | pnpm + Turborepo | Fast installs, parallel builds, shared packages |
| Marketing Site | Astro 4 | Zero-JS by default, best-in-class SEO, island architecture |
| Dashboard App | React 19 + Vite | SPA for authenticated UX, fast HMR |
| API Server | Node.js + Hono | Lightweight, edge-compatible, excellent TypeScript support |
| Edge Redirects | Cloudflare Workers | Sub-millisecond redirects globally |
| Language | TypeScript (strict) | Full-stack type safety |
| Styling | Tailwind CSS v4 | Utility-first, consistent design system |
| Components | shadcn/ui | Accessible, unstyled-first, owned in repo |
| Animations | Framer Motion | Production-grade UI animations |
| Auth | Firebase Authentication | Email, Google, magic link out of the box |
| Database | Firebase Firestore | Real-time, scalable NoSQL |
| File Storage | Firebase Storage | QR exports, avatar uploads |
| Caching / KV | Cloudflare KV | Ultra-fast link lookup at the edge |
| Email | Resend | Developer-friendly transactional email |
| Payments | Stripe | Industry-standard subscription billing |
| Analytics | PostHog (self or cloud) | Product analytics + session replay |
| Monitoring | Sentry | Error tracking across all apps |
| CI/CD | GitHub Actions | Lint, test, build, deploy pipeline |
| Deployment | Vercel (web + dashboard) + Cloudflare (redirect + KV) | |

---

## Code Standards

- **TypeScript strict mode** on all packages and apps — no `any`, no implicit returns.
- **Functional components only** in React — no class components.
- **Zod** for all runtime schema validation (API inputs, env vars).
- **React Query (TanStack Query)** for all server state in the dashboard.
- **Zustand** for minimal client-side global state.
- **ESLint + Prettier** enforced via pre-commit hooks (Husky + lint-staged).
- **Conventional Commits** (`feat:`, `fix:`, `chore:`) enforced via commitlint.
- **No barrel files** (`index.ts` re-exports) in `packages/` — explicit imports only.
- File naming: `kebab-case` for files, `PascalCase` for components, `camelCase` for functions.
- All API routes return `{ data, error, meta }` envelope.
- Environment variables validated with Zod at startup — app crashes fast if misconfigured.

---

## Project Phases Summary

| Phase | Name | Timeline | Status |
|---|---|---|---|
| 1 | MVP Core Tools | Weeks 1–6 | Planning |
| 2 | Growth & Analytics | Months 2–3 | Planning |
| 3 | Scale & Ecosystem | Months 4–6 | Planning |
| 4 | Enterprise & Platform | Month 6+ | Planning |

See `docs/` for detailed phase plans.

---

## Key Business Rules

- Free tier: 50 active links, 1 bio page, basic analytics (30-day retention).
- Pro tier ($9/month): Unlimited links, 3 custom domains, 1-year analytics retention.
- Business tier ($29/month): Teams (5 seats), API access, white-label QR.
- Enterprise: Custom pricing, SSO, SLA.
- All shortened links use `jorh.net/XXXX` (6-char base62 code) by default.
- Custom slug on Pro+. Custom domain on Pro+.
- Links never deleted from DB — just marked `deleted: true` (analytics preservation).
- GDPR: No PII stored in click analytics. IP hashed, not stored raw.

---

## Domain Structure

| Subdomain | Purpose |
|---|---|
| `jorh.net` | Marketing site (Astro) |
| `app.jorh.net` | Dashboard (React) |
| `api.jorh.net` | API (Node.js + Hono) |
| `go.jorh.net` | Redirect engine (Cloudflare Worker) |
| `[custom].jorh.net` | Pro custom short domains |

---

## File References

- `docs/PLANNING.md` — Master roadmap and product vision
- `docs/PHASE_1_MVP.md` — MVP: core tools, auth, landing page
- `docs/PHASE_2_GROWTH.md` — Analytics, bio pages, custom domains
- `docs/PHASE_3_SCALE.md` — API, teams, A/B testing, integrations
- `docs/PHASE_4_ENTERPRISE.md` — Enterprise features, white-label
- `docs/TECH_STACK.md` — Architecture deep-dive
- `docs/MARKETING.md` — Go-to-market strategy
- `docs/MONETIZATION.md` — Pricing, tiers, revenue model

---

## Claude Behavior Notes

- Always use the defined tech stack. Do not introduce libraries outside the stack without flagging it.
- All new features must have a corresponding Zod schema for input validation.
- Firestore collections follow the schema defined in `packages/types`.
- When generating UI, always use shadcn components first, then extend with Tailwind.
- Framer Motion animations should be subtle and purposeful — not decorative.
- API handlers must always validate with Zod before touching the database.
- Do not add comments explaining *what* code does — only *why* if non-obvious.
- Keep components small and single-purpose. Extract hooks for logic.
