# Cloud Run Deployment (Monorepo)

This directory contains Cloud Run deployment code for these services:
- `jorh-api` from `apps/api`
- `jorh-dashboard` from `apps/dashboard`
- `jorh-web` from `apps/web`

`apps/redirect` is a Cloudflare Worker and should keep using Wrangler, not Cloud Run.

## Prerequisites

- Google Cloud project with billing enabled
- Cloud Build API, Artifact Registry API, and Cloud Run API enabled
- `gcloud` authenticated and configured
- Artifact Registry repo created (example: `cloud-run` in your target region)

Example setup:

1. `gcloud auth login`
2. `gcloud config set project YOUR_PROJECT_ID`
3. `gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com`
4. `gcloud artifacts repositories create cloud-run --repository-format=docker --location=us-central1`

## Deploy Commands

Use the helper script:

1. `bash deploy/cloud-run/deploy.sh api YOUR_PROJECT_ID us-central1`
2. `bash deploy/cloud-run/deploy.sh dashboard YOUR_PROJECT_ID us-central1`
3. `bash deploy/cloud-run/deploy.sh web YOUR_PROJECT_ID us-central1`

Or from root package scripts:

1. `GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID pnpm deploy:cloud-run:api`
2. `GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID pnpm deploy:cloud-run:dashboard`
3. `GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID pnpm deploy:cloud-run:web`

## API Runtime Environment

`jorh-api` needs required env vars from `apps/api/src/env.ts`.
Set them on Cloud Run before traffic cutover.

Recommended approach:
- Store sensitive values in Secret Manager
- Attach secrets to the Cloud Run service with `--set-secrets`
- Set non-sensitive values with `--set-env-vars`

Example update:

`gcloud run services update jorh-api --region us-central1 --set-env-vars NODE_ENV=production,WEB_URL=https://jorh.net,APP_URL=https://app.jorh.net --set-secrets FIREBASE_PRIVATE_KEY=FIREBASE_PRIVATE_KEY:latest,FIREBASE_CLIENT_EMAIL=FIREBASE_CLIENT_EMAIL:latest,FIREBASE_PROJECT_ID=FIREBASE_PROJECT_ID:latest`

## Notes

- Containers listen on port `8080` for Cloud Run.
- Dashboard and web are built as static assets and served by NGINX.
- Dashboard NGINX config includes SPA fallback to `index.html`.
