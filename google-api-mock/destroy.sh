#!/bin/bash

set -euo pipefail

cd "$(dirname "$0")"

[ -z "${1-}" ] && (
  echo "Usage: $0 [env]"
  exit 128
)

env="${1}"

set -o allexport
source "../kahvilat-vault/${env}-secrets.env"
set +o allexport

export AWS_ACCESS_KEY_ID="${TF_VAR_aws_access_key}"
export AWS_SECRET_ACCESS_KEY="${TF_VAR_aws_secret_key}"
export AWS_DEFAULT_REGION="${TF_VAR_aws_region}"

sed -e "s/- serverless-offline//g" serverless.yml > serverless-$env.yml

serverless remove \
  --config serverless-$env.yml \
  --stage $env \
  --verbose

rm serverless-$env.yml
