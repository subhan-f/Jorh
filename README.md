# Jorh

A microservices-based URL shortener platform built as a Turborepo monorepo.

## Architecture

```
                        ┌─────────────────┐
                        │   API Gateway   │  :3000
                        │  (rate limit,   │
                        │   CORS, proxy)  │
                        └────────┬────────┘
                                 │
          ┌──────────────────────┼───────────────────────┐
          │                      │                       │
   ┌──────▼──────┐      ┌────────▼───────┐      ┌────────▼────────┐
   │    Auth     │      │     Links      │      │   Analytics     │
   │   Service   │:3001 │    Service     │:3002 │    Service      │:3003
   └─────────────┘      └───────┬────────┘      └────────▲────────┘
                                │  link.clicked          │
                                └──────── RabbitMQ ──────┘
                                           (fanout)

   ┌─────────────────┐      ┌──────────────────────────┐
   │ Redirect Service│:3004 │       Docs App           │
   │  (slug → URL)   │      │  (Remix, API reference)  │
   └─────────────────┘      └──────────────────────────┘
```

| Service             | Port | Description                                         |
| ------------------- | ---- | --------------------------------------------------- |
| `api-gateway`       | 3000 | Entry point — CORS, rate limiting, request proxying |
| `auth-service`      | 3001 | JWT auth — register, login, logout, profile         |
| `links-service`     | 3002 | CRUD for short links, custom slugs                  |
| `analytics-service` | 3003 | Click tracking, referrers, geo distribution         |
| `redirect-service`  | 3004 | Slug resolution with in-memory cache                |
| `docs`              | 5173 | Remix API reference site                            |

## Tech stack

- **Runtime**: Node.js 22 (ESM), Express 5
- **Database**: MongoDB (Mongoose)
- **Message broker**: RabbitMQ (fanout exchange)
- **Auth**: JWT (access + refresh tokens, server-side blacklist)
- **Docs**: Remix + Tailwind CSS
- **Monorepo**: Turborepo + pnpm workspaces
- **Containers**: Docker + Docker Compose
- **CI/CD**: GitHub Actions → GHCR

## Monorepo structure

```
apps/
  api-gateway/
  auth-service/
  links-service/
  analytics-service/
  redirect-service/
  docs/
packages/
  shared-auth/        # JWT sign/verify helpers
  shared-db/          # Mongoose connection
  shared-env/         # createConfig(), SERVICE_PORTS
  shared-errors/      # AppError hierarchy, error handler
  shared-logger/      # Pino logger + HTTP logger
  shared-messaging/   # RabbitMQ publish/subscribe
  ui/                 # shadcn-style React components
  api-client/         # Typed fetch client for the gateway
```

## Prerequisites

- Node.js ≥ 18
- pnpm ≥ 9
- MongoDB (Atlas or local)
- RabbitMQ (CloudAMQP or local via Docker)

## Getting started

```sh
# 1. Clone
git clone https://github.com/subhan-f/Jorh.git && cd Jorh

# 2. Install dependencies
pnpm install

# 3. Configure environment
cp .env.example .env
# Fill in MONGO_URI, RABBITMQ_URI, JWT secrets

# 4. Start all services in dev mode (with hot reload)
pnpm dev
```

## Docker

```sh
# Build and start all services + RabbitMQ
docker compose up --build

# Start in detached mode
docker compose up -d --build
```

> MongoDB is not included in `docker-compose.yml` — point `MONGO_URI` in your `.env` at Atlas or a separately managed instance.

## Environment variables

Copy `.env.example` to `.env` and fill in the values:

| Variable                 | Description                             |
| ------------------------ | --------------------------------------- |
| `MONGO_URI`              | MongoDB connection string               |
| `RABBITMQ_URI`           | RabbitMQ AMQP connection string         |
| `JWT_ACCESS_SECRET`      | Secret for signing access tokens        |
| `JWT_ACCESS_EXPIRATION`  | Access token TTL (e.g. `30m`)           |
| `JWT_REFRESH_SECRET`     | Secret for signing refresh tokens       |
| `JWT_REFRESH_EXPIRATION` | Refresh token TTL (e.g. `30d`)          |
| `CORS_ORIGINS`           | Comma-separated allowed origins         |
| `API_BASE_URL`           | Public gateway URL shown in the docs UI |

## CI/CD

On every push to `main`, GitHub Actions builds all five service images in parallel and pushes them to GHCR:

```
ghcr.io/subhan-f/jorh-api-gateway:latest
ghcr.io/subhan-f/jorh-auth-service:latest
ghcr.io/subhan-f/jorh-links-service:latest
ghcr.io/subhan-f/jorh-analytics-service:latest
ghcr.io/subhan-f/jorh-redirect-service:latest
```

Each image is also tagged with `sha-<short-commit>` for pinned deployments.

## API documentation

Run `pnpm dev` and open [http://localhost:5173](http://localhost:5173) to browse the interactive API reference.
