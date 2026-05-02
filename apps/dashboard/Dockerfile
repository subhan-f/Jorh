# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:22-bookworm-slim AS builder

WORKDIR /workspace

RUN corepack enable

# Copy manifests first so the install layer is cached independently of source changes
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/dashboard/package.json ./apps/dashboard/package.json
COPY packages/types/package.json ./packages/types/package.json
COPY packages/utils/package.json ./packages/utils/package.json
COPY packages/firebase/package.json ./packages/firebase/package.json
COPY packages/ui/package.json ./packages/ui/package.json
COPY packages/config ./packages/config

RUN pnpm install --frozen-lockfile

# Vite replaces import.meta.env.VITE_* at build time — must be set before `vite build`
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_FIREBASE_MEASUREMENT_ID
ARG VITE_API_URL
ARG VITE_REDIRECT_BASE
ARG VITE_POSTHOG_KEY
ARG VITE_POSTHOG_HOST

ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY \
    VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN \
    VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID \
    VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET \
    VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID \
    VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID \
    VITE_FIREBASE_MEASUREMENT_ID=$VITE_FIREBASE_MEASUREMENT_ID \
    VITE_API_URL=$VITE_API_URL \
    VITE_REDIRECT_BASE=$VITE_REDIRECT_BASE \
    VITE_POSTHOG_KEY=$VITE_POSTHOG_KEY \
    VITE_POSTHOG_HOST=$VITE_POSTHOG_HOST

# Copy shared package sources before the app — if only the app changes, these layers stay cached
COPY packages ./packages

# Compile workspace packages so Vite finds dist/ when it resolves the "import" condition
RUN pnpm --filter @jorh/types build
RUN pnpm --filter @jorh/utils build

# Copy app source last (most likely to change between commits)
COPY apps/dashboard ./apps/dashboard

RUN pnpm --filter @jorh/dashboard build

# ─── Stage 2: Serve ───────────────────────────────────────────────────────────
FROM nginx:1.27-alpine

COPY apps/dashboard/deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /workspace/apps/dashboard/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
