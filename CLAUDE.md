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
│   ├── web/          # Astro 6 — marketing site, landing page, tool pages (SEO)
│   ├── dashboard/    # React 19 + Vite — authenticated user dashboard
│   ├── api/          # Node.js + Hono — REST API
│   └── redirect/     # Cloudflare Workers — edge-level link redirect service
├── packages/
│   ├── ui/           # Shared component library (shadcn/ui + custom)
│   ├── types/        # Shared TypeScript types, Zod schemas, API helpers
│   ├── utils/        # Shared pure utility functions
│   ├── firebase/     # Firebase SDK wrapper (auth, firestore, storage)
│   └── config/       # Shared configs: tailwind, tsconfig, eslint, prettier
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
└── .env.example
```

> `packages/analytics/` exists as a directory with a `src/` stub but has no `package.json` — it is not a workspace package yet.

---

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Monorepo | pnpm 10 + Turborepo 2 | Fast installs, parallel builds, shared packages |
| Marketing Site | Astro 6 | Zero-JS by default, best-in-class SEO, island architecture |
| Dashboard App | React 19 + Vite 6 | SPA for authenticated UX, fast HMR |
| API Server | Node.js 22 + Hono 4 | Lightweight, edge-compatible, excellent TypeScript support |
| Edge Redirects | Cloudflare Workers | Sub-millisecond redirects globally |
| Language | TypeScript 5 (strict) | Full-stack type safety |
| Styling | Tailwind CSS v4 | Utility-first, consistent design system |
| Components | shadcn/ui | Accessible, unstyled-first, owned in repo |
| Animations | Framer Motion | Production-grade UI animations |
| Auth | Firebase Authentication | Email/password + Google OAuth |
| Database | Firebase Firestore | Real-time, scalable NoSQL |
| File Storage | Firebase Storage | QR exports, avatar uploads |
| Caching / KV | Cloudflare KV | Ultra-fast link lookup at the edge |
| Email | Resend | Developer-friendly transactional email |
| Payments | Stripe | Industry-standard subscription billing |
| Analytics | PostHog (self or cloud) | Product analytics + session replay |
| Monitoring | Sentry | Error tracking across all apps |
| CI/CD | Google Cloud Build | Lint, build, deploy pipeline |
| Deployment | Google Cloud Run (web + dashboard + api) + Cloudflare Workers (redirect) | |

---

## Deployment

All three server apps are containerised (Dockerfile per app) and deployed to **Google Cloud Run** in `us-central1` under project `jorh-1`.

| Service | Cloud Build config | Cloud Run service |
|---|---|---|
| API | `deploy/cloud-run/cloudbuild.api.yaml` | `jorh-api` |
| Dashboard | `deploy/cloud-run/cloudbuild.dashboard.yaml` | `jorh-dashboard` |
| Marketing | `deploy/cloud-run/cloudbuild.web.yaml` | `jorh-web` |

Deploy any service via `bash deploy/cloud-run/deploy.sh <api|dashboard|web>`.

Current live URLs (until custom domains are mapped):
- API: `https://jorh-api-599388754417.us-central1.run.app`
- Dashboard: `https://jorh-dashboard-599388754417.us-central1.run.app`
- Web: `https://jorh-web-599388754417.us-central1.run.app`

Secrets (Firebase private key, internal API secret) live in **GCP Secret Manager** and are injected at deploy time via `--set-secrets`.

---

## Domain Structure (Target)

| Subdomain | Purpose |
|---|---|
| `jorh.net` | Marketing site (Astro) |
| `app.jorh.net` | Dashboard (React) |
| `api.jorh.net` | API (Node.js + Hono) |
| `go.jorh.net` | Redirect engine (Cloudflare Worker) |
| `[custom].jorh.net` | Pro custom short domains |

> Custom domains are not yet mapped. See current Cloud Run URLs above.

---

## Environment Variables

Key env vars and their conventions:

- **`CORS_ORIGINS`** — Pipe-separated list of allowed CORS origins for the API (e.g. `https://a.com|https://b.com`). Pipe avoids conflict with the comma delimiter used by `gcloud --set-env-vars`. Defaults to `http://localhost:3000|http://localhost:3001` in dev.
- **`FIREBASE_PRIVATE_KEY`** — Injected from Secret Manager. The API's `lib/firebase.ts` does `.replace(/\\n/g, "\n")` on it.
- **`INTERNAL_API_SECRET`** — Shared secret between the Cloudflare Worker and the API for the `/analytics/click` endpoint.
- **`VITE_*`** / **`PUBLIC_*`** — Build-time env vars for dashboard (Vite) and web (Astro). Baked in at Docker build time via `--build-arg`.

---

## Firebase Project

- **Project ID:** `jorh-1`
- **Auth:** Email/password + Google OAuth enabled
- **Firestore rules:** Fully locked down (`allow read, write: if false`). All access goes through the API which uses the Firebase Admin SDK.
- **Service account:** `firebase-adminsdk-fbsvc@jorh-1.iam.gserviceaccount.com`

---

## Code Standards

- **TypeScript strict mode** on all packages and apps — no `any`, no implicit returns.
- **Functional components only** in React — no class components.
- **Zod** for all runtime schema validation (API inputs, env vars).
- **React Query (TanStack Query)** for all server state in the dashboard.
- **Zustand** for minimal client-side global state.
- **ESLint + Prettier** enforced via pre-commit hooks (Husky + lint-staged).
- **Conventional Commits** (`feat:`, `fix:`, `chore:`) enforced via commitlint.
- **`packages/types` and `packages/utils`** export from `src/index.ts` (TypeScript source) for IDE resolution, and compile to `dist/` for Node.js runtime consumption. Do not add a `dist/` folder to `.gitignore` for these packages.
- File naming: `kebab-case` for files, `PascalCase` for components, `camelCase` for functions.
- All API routes return `{ data, error, meta }` envelope via `ok()` / `err()` helpers from `@jorh/types`.
- Environment variables validated with Zod at startup — app crashes fast if misconfigured.
- Import extensions: use `.js` in TypeScript source files for ESM compatibility (e.g. `import { x } from "./foo.js"`).

---

## Project Phases Summary

| Phase | Name | Timeline | Status |
|---|---|---|---|
| 1 | MVP Core Tools | Weeks 1–6 | In Progress |
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
- Links never deleted from DB — just marked `isDeleted: true` (analytics preservation).
- GDPR: No PII stored in click analytics. IP hashed, not stored raw.

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
- Firestore collections follow the schema defined in `packages/types`. Collections: `users`, `links`, `clicks`, `bioPages`, `workspaces`, `qrCodes`.
- When generating UI, always use shadcn components first, then extend with Tailwind.
- Framer Motion animations should be subtle and purposeful — not decorative.
- API handlers must always validate with Zod before touching the database.
- Do not add comments explaining *what* code does — only *why* if non-obvious.
- Keep components small and single-purpose. Extract hooks for logic.
- API CORS is controlled by the `CORS_ORIGINS` env var (pipe-separated). Never hardcode origin URLs in source code.
- When adding new Cloud Run env vars, use the `_CORS_ORIGINS` pipe pattern for any multi-value string to avoid `--set-env-vars` comma-delimiter conflicts.
