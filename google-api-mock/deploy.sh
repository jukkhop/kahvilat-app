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

export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
export AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION}

sed -e "s/- serverless-offline//g" serverless.yml > serverless-$env.yml

serverless deploy \
  --config serverless-$env.yml \
  --region ${AWS_DEFAULT_REGION} \
  --stage $env \
  --verbose

rm serverless-$env.yml
