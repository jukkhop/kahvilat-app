#!/usr/bin/env bash
set -e

cd $(dirname $0)

[ -z "${1-}" ] && (
  echo "Usage: $0 [env]"
  exit 128
)

env=$1

source "../kahvilat-scripts/aws-utils.sh"
source "../kahvilat-vault/${env}-secrets.env"

export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
export AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION}

bucket=${UI_DOMAIN_NAME}

aws s3 rm --recursive --quiet "s3://${bucket}"
aws s3 sync build/ "s3://${bucket}"

aws cloudfront create-invalidation \
  --distribution-id "$(get_cloudfront_distribution_id ${bucket})" \
  --paths "/*" 1>/dev/null
