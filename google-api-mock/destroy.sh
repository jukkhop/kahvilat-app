#!/usr/bin/env bash
set -e

cd $(dirname $0)

[ -z "${1-}" ] && (
  echo "Usage: $0 [env]"
  exit 128
)

env=$1

set -o allexport
source "../kahvilat-vault/${env}-secrets.env"
set +o allexport

export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
export AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION}

sed -e "s/- serverless-offline//g" serverless.yml > serverless-$env.yml

serverless remove \
  --config serverless-$env.yml \
  --stage $env \
  --verbose

rm serverless-$env.yml
