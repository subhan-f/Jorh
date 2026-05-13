FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS pruner
WORKDIR /app
RUN pnpm add -g turbo@2
COPY . .
RUN turbo prune redirect-service --docker

FROM base AS installer
WORKDIR /app
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile --prod

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=pruner /app/out/full/ .
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/redirect-service/node_modules ./apps/redirect-service/node_modules

WORKDIR /app/apps/redirect-service
EXPOSE 3004
CMD ["node", "server.js"]
