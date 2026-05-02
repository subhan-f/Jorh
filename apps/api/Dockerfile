# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:22-bookworm-slim AS builder

WORKDIR /workspace

RUN corepack enable

# Copy manifests first so the install layer is cached independently of source changes
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages/types/package.json ./packages/types/package.json
COPY packages/utils/package.json ./packages/utils/package.json
COPY packages/config ./packages/config

RUN pnpm install --frozen-lockfile

# Copy source after install to preserve the cached install layer
COPY apps/api ./apps/api
COPY packages/types ./packages/types
COPY packages/utils ./packages/utils

# Turborepo respects ^build dependency order: types → utils → api
RUN pnpm exec turbo build --filter=@jorh/api

# Produce a self-contained deployment dir: resolved prod deps + workspace packages
RUN pnpm deploy --filter=@jorh/api --prod /prod/api

# ─── Stage 2: Production ──────────────────────────────────────────────────────
FROM node:22-bookworm-slim AS runner

WORKDIR /app

COPY --from=builder /prod/api .

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# Direct node invocation — receives SIGTERM from Cloud Run for graceful shutdown
CMD ["node", "dist/index.js"]
