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

yarn install

BACKEND_BASE_URL=${TF_VAR_backend_base_url} yarn jest
