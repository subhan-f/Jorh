# Jorh.net — Technical Architecture

## Monorepo Structure

```
jorh.net/
├── apps/
│   ├── web/                     # Astro 4 — marketing, SEO, tool landing pages
│   ├── dashboard/               # React 19 + Vite — authenticated dashboard SPA
│   ├── api/                     # Node.js 22 + Hono — REST API server
│   └── redirect/                # Cloudflare Workers — edge redirect engine
│
├── packages/
│   ├── ui/                      # Shared React component library
│   ├── types/                   # Shared TypeScript types
│   ├── utils/                   # Shared pure utility functions
│   ├── firebase/                # Firebase SDK wrapper
│   ├── analytics/               # Analytics event abstraction
│   └── config/
│       ├── tailwind/            # Shared Tailwind preset
│       ├── typescript/          # Shared tsconfig bases
│       └── eslint/              # Shared ESLint flat config
│
├── turbo.json                   # Turborepo pipeline config
├── pnpm-workspace.yaml
├── package.json                 # Root devDependencies (turbo, husky, etc.)
├── .env.example
└── .github/
    └── workflows/
        ├── ci.yml
        └── deploy.yml
```

---

## Configuration Files

### `pnpm-workspace.yaml`
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### `turbo.json`
```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": ["dist/**", ".next/**", ".astro/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "typecheck": {
      "dependsOn": ["^typecheck"]
    }
  }
}
```

### Root `package.json`
```json
{
  "name": "jorh",
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "test": "turbo test",
    "typecheck": "turbo typecheck",
    "format": "prettier --write \"**/*.{ts,tsx,md}\""
  },
  "devDependencies": {
    "turbo": "^2.x",
    "@commitlint/cli": "^19.x",
    "@commitlint/config-conventional": "^19.x",
    "husky": "^9.x",
    "lint-staged": "^15.x",
    "prettier": "^3.x",
    "typescript": "^5.x"
  },
  "engines": {
    "node": ">=22",
    "pnpm": ">=9"
  }
}
```

---

## App: `apps/web` (Astro 4)

**Purpose:** Marketing site, SEO tool landing pages, public bio pages.

**Key packages:**
```json
{
  "dependencies": {
    "astro": "^4.x",
    "@astrojs/react": "^3.x",
    "@astrojs/tailwind": "^5.x",
    "@astrojs/sitemap": "^3.x",
    "framer-motion": "^11.x",
    "react": "^19.x",
    "react-dom": "^19.x"
  }
}
```

**`astro.config.mjs`:**
```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jorh.net',
  integrations: [react(), tailwind(), sitemap()],
  output: 'hybrid', // static default, SSR for dynamic routes (bio pages)
  adapter: cloudflare(), // or vercel()
});
```

**Rendering strategy:**
- Marketing pages: fully static (`export const prerender = true`)
- Bio pages (`/bio/[slug]`): SSR for fresh data + ISR caching
- Tool pages: static shell + React islands for interactivity

---

## App: `apps/dashboard` (React + Vite)

**Purpose:** Authenticated user workspace.

**Key packages:**
```json
{
  "dependencies": {
    "react": "^19.x",
    "react-dom": "^19.x",
    "react-router-dom": "^7.x",
    "@tanstack/react-query": "^5.x",
    "zustand": "^5.x",
    "react-hook-form": "^7.x",
    "zod": "^3.x",
    "@hookform/resolvers": "^3.x",
    "framer-motion": "^11.x",
    "recharts": "^2.x",
    "@dnd-kit/core": "^6.x",
    "@dnd-kit/sortable": "^8.x",
    "firebase": "^10.x",
    "sonner": "^1.x"
  }
}
```

**`vite.config.ts`:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    port: 3001,
    proxy: {
      '/api': 'http://localhost:3002',
    },
  },
});
```

---

## App: `apps/api` (Node.js + Hono)

**Purpose:** REST API — business logic, database operations, integrations.

**Key packages:**
```json
{
  "dependencies": {
    "hono": "^4.x",
    "@hono/zod-validator": "^0.x",
    "@hono/swagger-ui": "^0.x",
    "zod": "^3.x",
    "firebase-admin": "^12.x",
    "stripe": "^16.x",
    "resend": "^3.x",
    "qrcode": "^1.x",
    "sharp": "^0.x",
    "open-graph-scraper": "^6.x",
    "bcryptjs": "^2.x"
  }
}
```

**Route structure:**
```
src/
├── index.ts             # Hono app entry, middleware registration
├── routes/
│   ├── auth.ts
│   ├── links.ts
│   ├── bio-pages.ts
│   ├── analytics.ts
│   ├── qr.ts
│   ├── tools.ts
│   ├── billing.ts
│   ├── webhooks.ts
│   └── admin.ts
├── middleware/
│   ├── auth.ts          # Firebase token verification
│   ├── rate-limit.ts
│   └── error.ts
├── services/
│   ├── link.service.ts
│   ├── analytics.service.ts
│   ├── qr.service.ts
│   └── email.service.ts
├── lib/
│   ├── firebase.ts      # Admin SDK init
│   ├── kv.ts            # Cloudflare KV sync
│   └── stripe.ts
└── env.ts               # Zod env validation
```

---

## App: `apps/redirect` (Cloudflare Workers)

**Purpose:** Edge-level URL redirect engine. Zero cold starts, <50ms globally.

**Key packages:**
```json
{
  "dependencies": {
    "hono": "^4.x",
    "itty-router": "^5.x"
  },
  "devDependencies": {
    "wrangler": "^3.x",
    "@cloudflare/workers-types": "^4.x"
  }
}
```

**`wrangler.toml`:**
```toml
name = "jorh-redirect"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[[kv_namespaces]]
binding = "LINKS_KV"
id = "your-kv-namespace-id"

[[queues.producers]]
queue = "click-events"
binding = "CLICK_QUEUE"
```

---

## Package: `packages/ui`

Shared component library built on top of shadcn/ui.

**Setup:**
- shadcn/ui components are copied into this package (owned in repo, not an npm dep)
- Tailwind CSS peer dependency
- All components exported with tree-shaking support

**Key components (Phase 1):**
```
src/
├── components/
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── table.tsx
│   ├── toast.tsx       # via sonner
│   ├── tooltip.tsx
│   ├── switch.tsx
│   ├── tabs.tsx
│   └── copy-button.tsx # custom: copy + checkmark animation
├── hooks/
│   └── use-copy.ts
└── index.ts
```

---

## Package: `packages/types`

All shared TypeScript interfaces and Zod schemas.

```typescript
// link.ts
export interface Link {
  id: string;
  ownerId: string;
  workspaceId?: string;
  originalUrl: string;
  shortCode: string;
  customSlug?: string;
  title?: string;
  tags: string[];
  type: LinkType;
  password?: string;
  expiresAt?: Date;
  clickLimit?: number;
  clickCount: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type LinkType = 'short' | 'bio' | 'qr' | 'whatsapp' | 'rotator';

export const CreateLinkSchema = z.object({
  originalUrl: z.string().url(),
  customSlug: z.string().min(3).max(30).regex(/^[a-zA-Z0-9-]+$/).optional(),
  title: z.string().max(100).optional(),
  tags: z.array(z.string()).max(10).default([]),
  password: z.string().min(4).max(50).optional(),
  expiresAt: z.string().datetime().optional(),
  clickLimit: z.number().int().positive().optional(),
});
```

---

## CI/CD Pipeline

### GitHub Actions — `ci.yml`
```yaml
name: CI
on: [push, pull_request]
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo typecheck lint test build
```

### Deployment targets:
| App | Platform | Trigger |
|---|---|---|
| `apps/web` | Vercel | Push to `main` |
| `apps/dashboard` | Vercel | Push to `main` |
| `apps/api` | Railway / Fly.io | Push to `main` |
| `apps/redirect` | Cloudflare Workers | Push to `main` (wrangler deploy) |

---

## Environment Variables

```bash
# Firebase (all apps)
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

# Cloudflare (redirect worker)
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_API_TOKEN=
CLOUDFLARE_KV_NAMESPACE_ID=

# Stripe (api)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=
STRIPE_BUSINESS_PRICE_ID=

# Resend (api)
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# PostHog (dashboard + web)
POSTHOG_API_KEY=
POSTHOG_HOST=

# Sentry (all apps)
SENTRY_DSN=
SENTRY_AUTH_TOKEN=

# App URLs
VITE_API_URL=https://api.jorh.net
VITE_APP_URL=https://app.jorh.net
PUBLIC_REDIRECT_BASE=https://go.jorh.net
```
