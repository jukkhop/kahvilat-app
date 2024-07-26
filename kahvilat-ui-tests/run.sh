#!/usr/bin/env bash

set -e

cd $(dirname $0)

if [ "${1-}" != "dev" ]; then
  echo "Usage: $0 dev"
  exit 128
fi

env=$1

set -o allexport
source "../kahvilat-vault/${env}-secrets.env"
set +o allexport

export CYPRESS_BASE_URL=$"https://${UI_DOMAIN_NAME}"

npm install
npm run cypress:run
