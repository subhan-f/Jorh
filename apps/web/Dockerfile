FROM node:alpine AS base
RUN npm install -g pnpm@11.1.1 turbo@2

FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune web --docker

FROM base AS builder
WORKDIR /app
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
ARG VITE_API_URL
ARG VITE_DASHBOARD_URL
ARG VITE_DOCS_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_DASHBOARD_URL=$VITE_DASHBOARD_URL
ENV VITE_DOCS_URL=$VITE_DOCS_URL
RUN pnpm --filter=web build

FROM nginx:alpine AS runner
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
