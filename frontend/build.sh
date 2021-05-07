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

yarn install
yarn format
yarn lint

REACT_APP_BACKEND_BASE_URL=${TF_VAR_backend_base_url} \
REACT_APP_GOOGLE_API_KEY=${TF_VAR_frontend_google_api_key} \
yarn build
