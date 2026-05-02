# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:22-bookworm-slim AS builder

WORKDIR /workspace

RUN corepack enable

# Copy manifests first so the install layer is cached independently of source changes
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/web/package.json ./apps/web/package.json
COPY packages/types/package.json ./packages/types/package.json
COPY packages/utils/package.json ./packages/utils/package.json
COPY packages/firebase/package.json ./packages/firebase/package.json
COPY packages/ui/package.json ./packages/ui/package.json
COPY packages/config ./packages/config

RUN pnpm install --frozen-lockfile

# Astro replaces import.meta.env.PUBLIC_* at build time — these must be set before `astro build`
ARG PUBLIC_FIREBASE_API_KEY
ARG PUBLIC_FIREBASE_AUTH_DOMAIN
ARG PUBLIC_FIREBASE_PROJECT_ID
ARG PUBLIC_FIREBASE_STORAGE_BUCKET
ARG PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG PUBLIC_FIREBASE_APP_ID
ARG PUBLIC_API_URL
ARG PUBLIC_POSTHOG_KEY
ARG PUBLIC_POSTHOG_HOST

ENV PUBLIC_FIREBASE_API_KEY=$PUBLIC_FIREBASE_API_KEY \
    PUBLIC_FIREBASE_AUTH_DOMAIN=$PUBLIC_FIREBASE_AUTH_DOMAIN \
    PUBLIC_FIREBASE_PROJECT_ID=$PUBLIC_FIREBASE_PROJECT_ID \
    PUBLIC_FIREBASE_STORAGE_BUCKET=$PUBLIC_FIREBASE_STORAGE_BUCKET \
    PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$PUBLIC_FIREBASE_MESSAGING_SENDER_ID \
    PUBLIC_FIREBASE_APP_ID=$PUBLIC_FIREBASE_APP_ID \
    PUBLIC_API_URL=$PUBLIC_API_URL \
    PUBLIC_POSTHOG_KEY=$PUBLIC_POSTHOG_KEY \
    PUBLIC_POSTHOG_HOST=$PUBLIC_POSTHOG_HOST

# Copy source after install to preserve the cached install layer
COPY apps/web ./apps/web
COPY packages ./packages

RUN pnpm --filter @jorh/web build

# ─── Stage 2: Serve ───────────────────────────────────────────────────────────
FROM nginx:1.27-alpine

COPY apps/web/deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /workspace/apps/web/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
