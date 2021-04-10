#!/bin/bash

set -euo pipefail

cd "$(dirname "$0")"

[ -z "${1-}" ] && (
  echo "Usage: $0 [env]"
  exit 128
)

env="${1}"

set -o allexport

source "../environment/${env}-secrets.env"
source "../environment/${env}-variables.env"

set +o allexport

backend_url="https://${TF_VAR_env}.api.${TF_VAR_app_domain_name}"
google_api_key="${TF_VAR_frontend_google_api_key}"

yarn install
yarn format
yarn lint

ENV=$env \
REACT_APP_BACKEND_URL=$backend_url \
REACT_APP_GOOGLE_API_KEY=$google_api_key \
yarn build
