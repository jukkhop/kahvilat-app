#!/bin/bash

set -euo pipefail

cd "$(dirname "$0")"

[ -z "${1-}" ] && (
  echo "Usage: $0 [env]"
  exit 128
)

env="${1}"

source "../kahvilat-vault/${env}-secrets.env"

export REACT_APP_API_BASE_URL=${TF_VAR_api_base_url}
export REACT_APP_GOOGLE_API_KEY=${TF_VAR_ui_google_api_key}

npm install
npm run format
npm run lint
npm run build
