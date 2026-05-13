FROM node:alpine AS base
RUN npm install -g pnpm@11.1.1 turbo@2

FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune redirect-service --docker

FROM base AS installer
WORKDIR /app
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile --prod
COPY --from=pruner /app/out/full/ .

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=installer /app .
WORKDIR /app/apps/redirect-service
EXPOSE 3004
CMD ["node", "server.js"]
