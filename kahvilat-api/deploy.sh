#!/bin/bash

set -euo pipefail

cd "$(dirname "$0")"

[ -z "${1-}" ] && (
  echo "Usage: $0 [env]"
  exit 128
)

env="${1}"

source "../kahvilat-vault/${env}-secrets.env"
source "../kahvilat-vault/scripts/aws-utils.sh"

export AWS_ACCESS_KEY_ID="${TF_VAR_aws_access_key}"
export AWS_SECRET_ACCESS_KEY="${TF_VAR_aws_secret_key}"
export AWS_DEFAULT_REGION="${TF_VAR_aws_region}"

redis_cluster_id="kahvilat-app-${env}-redis-cluster"
security_group_name="kahvilat-app-${env}-lambda-sg"
subnet_name="kahvilat-app-${env}-subnet-private"

sed -e "s/- serverless-offline//g" serverless.yml > serverless-$env.yml

serverless deploy \
  --config serverless-$env.yml \
  --param="google-api-key=${TF_VAR_api_google_api_key}" \
  --param="google-base-url=${TF_VAR_api_google_base_url}" \
  --param="google-language=${TF_VAR_api_google_language}" \
  --param="redis-host=$(get_redis_endpoint_address $redis_cluster_id)" \
  --param="redis-port=$(get_redis_endpoint_port $redis_cluster_id)" \
  --param="security-group-id=$(get_security_group_id $security_group_name)" \
  --param="subnet-id=$(get_subnet_id $subnet_name)" \
  --param="ui-base-url=https://${TF_VAR_ui_domain_name}" \
  --region ${TF_VAR_aws_region} \
  --stage $env \
  --verbose

rm serverless-$env.yml
