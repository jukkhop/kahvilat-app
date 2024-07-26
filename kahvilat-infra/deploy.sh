#!/usr/bin/env bash
set -e

cd $(dirname $0)

[ -z "${1-}" ] && (
  echo "Usage: $0 [env]"
  exit 128
)

env=$1
shift
terraform_options="${@:-}"

source "../kahvilat-vault/${env}-secrets.env"

export TF_VAR_aws_access_key=${AWS_ACCESS_KEY_ID}
export TF_VAR_aws_region=${AWS_DEFAULT_REGION}
export TF_VAR_aws_secret_key=${AWS_SECRET_ACCESS_KEY}
export TF_VAR_redis_cluster_id=${REDIS_CLUSTER_ID}
export TF_VAR_ui_certificate_arn=${UI_CERTIFICATE_ARN}
export TF_VAR_ui_domain_name=${UI_DOMAIN_NAME}
export TF_VAR_ui_zone_id=${UI_ZONE_ID}

terraform init \
  -backend-config="access_key=${AWS_ACCESS_KEY_ID}" \
  -backend-config="secret_key=${AWS_SECRET_ACCESS_KEY}"

terraform workspace select ${env} || terraform workspace new ${env}
terraform apply ${terraform_options}
