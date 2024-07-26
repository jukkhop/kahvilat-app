#!/usr/bin/env bash
set -e

cd $(dirname $0)

[ -z "${1-}" ] && (
  echo "Usage: $0 [stage]"
  exit 128
)

set -o allexport
source "../kahvilat-scripts/aws-utils.sh"
source "../kahvilat-vault/${1}-secrets.env"
set +o allexport

export REDIS_HOST=$(get_redis_endpoint_address $REDIS_CLUSTER_ID)
export REDIS_PORT=$(get_redis_endpoint_port $REDIS_CLUSTER_ID)

npx cdk bootstrap
npx cdk deploy
