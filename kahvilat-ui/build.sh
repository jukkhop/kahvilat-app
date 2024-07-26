#!/usr/bin/env bash
set -e

cd $(dirname $0)

[ -z "${1-}" ] && (
  echo "Usage: $0 [env]"
  exit 128
)

env=$1

source "../kahvilat-vault/${env}-secrets.env"

export REACT_APP_API_BASE_URL=${API_BASE_URL}
export REACT_APP_GOOGLE_API_KEY=${UI_GOOGLE_API_KEY}

npm install
npm run format
npm run lint
npm run build
