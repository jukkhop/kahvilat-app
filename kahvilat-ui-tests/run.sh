#!/bin/bash

set -euo pipefail

cd "$(dirname "$0")"

if [ "${1-}" != "dev" ]; then
  echo "Usage: $0 dev"
  exit 128
fi

env="${1}"

set -o allexport

source "../kahvilat-vault/${env}-secrets.env"
source "../kahvilat-vault/${env}-variables.env"

set +o allexport

export CYPRESS_BASE_URL=$"https://${TF_VAR_ui_domain_name}"

npm install
npm run cypress:run
