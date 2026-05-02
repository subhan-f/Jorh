#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <api|dashboard|web> [project-id] [region]"
  exit 1
fi

SERVICE="$1"
PROJECT_ID="${2:-${GOOGLE_CLOUD_PROJECT:-}}"
REGION="${3:-us-central1}"
TAG="$(date +%Y%m%d%H%M%S)"

if [[ -z "$PROJECT_ID" ]]; then
  echo "Missing project id. Provide as arg 2 or set GOOGLE_CLOUD_PROJECT."
  exit 1
fi

case "$SERVICE" in
  api)
    CONFIG="deploy/cloud-run/cloudbuild.api.yaml"
    SERVICE_NAME="jorh-api"
    ;;
  dashboard)
    CONFIG="deploy/cloud-run/cloudbuild.dashboard.yaml"
    SERVICE_NAME="jorh-dashboard"
    ;;
  web)
    CONFIG="deploy/cloud-run/cloudbuild.web.yaml"
    SERVICE_NAME="jorh-web"
    ;;
  *)
    echo "Unknown service: $SERVICE"
    echo "Supported: api, dashboard, web"
    exit 1
    ;;
esac

gcloud builds submit \
  --config "$CONFIG" \
  --substitutions "_PROJECT_ID=$PROJECT_ID,_REGION=$REGION,_SERVICE=$SERVICE_NAME,_TAG=$TAG" \
  .

echo "Deployment submitted for $SERVICE_NAME in $PROJECT_ID/$REGION"
