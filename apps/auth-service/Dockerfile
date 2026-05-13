FROM node:alpine AS base
RUN npm install -g pnpm@11.1.1 turbo@2

FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune auth-service --docker

FROM base AS installer
WORKDIR /app
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile --prod
COPY --from=pruner /app/out/full/ .

FROM node:alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=installer /app .
WORKDIR /app/apps/auth-service
EXPOSE 3001
CMD ["node", "server.js"]
