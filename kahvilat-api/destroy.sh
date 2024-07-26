#!/usr/bin/env bash
set -e

cd $(dirname $0)

[ -z "${1-}" ] && (
  echo "Usage: $0 [stage]"
  exit 128
)

set -o allexport
source "../kahvilat-vault/${1}-secrets.env"
set +o allexport

npx cdk destroy
