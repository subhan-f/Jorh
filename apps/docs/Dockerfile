FROM node:alpine AS base
RUN npm install -g pnpm@11.1.1 turbo@2

FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune docs --docker

FROM base AS builder
WORKDIR /app
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN pnpm --filter=docs build

FROM node:alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/docs/build ./build
COPY --from=builder /app/apps/docs/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node_modules/.bin/remix-serve", "./build/server/index.js"]
