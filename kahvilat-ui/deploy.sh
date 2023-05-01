#!/bin/bash

set -euo pipefail

cd "$(dirname "$0")"

[ -z "${1-}" ] && (
  echo "Usage: $0 [env]"
  exit 128
)

env="${1}"

source "../kahvilat-vault/${env}-secrets.env"
source "../kahvilat-vault/${env}-variables.env"
source "../kahvilat-vault/scripts/aws-utils.sh"

export AWS_ACCESS_KEY_ID="${TF_VAR_aws_access_key}"
export AWS_SECRET_ACCESS_KEY="${TF_VAR_aws_secret_key}"
export AWS_DEFAULT_REGION="${TF_VAR_aws_region}"

bucket="${TF_VAR_ui_domain_name}"

aws s3 rm --recursive --quiet "s3://${bucket}"
aws s3 sync build/ "s3://${bucket}"

aws cloudfront create-invalidation \
  --distribution-id "$(get_cloudfront_distribution_id $bucket)" \
  --paths "/*" 1>/dev/null
