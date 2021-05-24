#!/bin/bash

set -euo pipefail

cd "$(dirname "$0")"

if [ "${1-}" != "dev" ]; then
  echo "Usage: $0 dev"
  exit 128
fi

env="${1}"

set -o allexport

source "../environment/${env}-secrets.env"
source "../environment/${env}-variables.env"

set +o allexport

cypress_base_url="https://${TF_VAR_app_subdomain_name}"

yarn install
CYPRESS_BASE_URL=$cypress_base_url yarn cypress:run
