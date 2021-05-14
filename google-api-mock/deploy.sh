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

export AWS_ACCESS_KEY_ID="${TF_VAR_aws_access_key}"
export AWS_SECRET_ACCESS_KEY="${TF_VAR_aws_secret_key}"
export AWS_DEFAULT_REGION="${TF_VAR_aws_region}"

head -$(($(wc -l < serverless.yml) - 1)) serverless.yml > serverless-$env.yml

serverless deploy \
  --config serverless-$env.yml \
  --region ${TF_VAR_aws_region} \
  --stage $env \
  --verbose

rm serverless-$env.yml
