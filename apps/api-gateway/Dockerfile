FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Prune the monorepo to only what this service needs
FROM base AS pruner
WORKDIR /app
RUN pnpm add -g turbo@2
COPY . .
RUN turbo prune api-gateway --docker

# Install only production dependencies
FROM base AS installer
WORKDIR /app
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile --prod

# Final lean image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=pruner /app/out/full/ .
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/api-gateway/node_modules ./apps/api-gateway/node_modules

WORKDIR /app/apps/api-gateway
EXPOSE 3000
CMD ["node", "server.js"]
