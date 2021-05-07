#!/bin/bash

set -euo pipefail

cd "$(dirname "$0")"

[ -z "${1-}" ] && (
  echo "Usage: $0 [env]"
  exit 128
)

env="${1}"

set -o allexport

source "../environment/${env}-secrets.env"
source "../environment/${env}-variables.env"

set +o allexport

export AWS_ACCESS_KEY_ID="${TF_VAR_aws_access_key}"
export AWS_SECRET_ACCESS_KEY="${TF_VAR_aws_secret_key}"
export AWS_DEFAULT_REGION="${TF_VAR_aws_region}"

source "../environment/scripts/aws-utils.sh"

redis_cluster_id="kahvilat-app-${env}-redis-cluster"
security_group_name="kahvilat-app-${env}-lambda-sg"
subnet_name="kahvilat-app-${env}-subnet-private"

head -$(($(wc -l < serverless.yml) - 1)) serverless.yml > serverless-$env.yml

serverless deploy \
  --config serverless-$env.yml \
  --frontend-url "https://${TF_VAR_app_subdomain_name}" \
  --google-api-key ${TF_VAR_backend_google_api_key} \
  --google-base-url ${TF_VAR_backend_google_base_url} \
  --google-language ${TF_VAR_backend_google_language} \
  --redis-host "$(get_redis_endpoint_address $redis_cluster_id)" \
  --redis-port "$(get_redis_endpoint_port $redis_cluster_id)" \
  --region ${TF_VAR_aws_region} \
  --security-group-id "$(get_security_group_id $security_group_name)" \
  --subnet-id "$(get_subnet_id $subnet_name)" \
  --stage $env \
  --verbose

rm serverless-$env.yml
