#!/bin/bash

set -euo pipefail

cd "$(dirname "$0")"

[ -z "${1-}" ] && (
  echo "Usage: $0 [env]"
  exit 128
)

env="${1}"
shift
terraform_options="${@:-}"

set -o allexport
source "../kahvilat-vault/${env}-secrets.env"
set +o allexport

terraform init \
  -backend-config="access_key=${TF_VAR_aws_access_key}" \
  -backend-config="secret_key=${TF_VAR_aws_secret_key}"

terraform workspace select ${env} || terraform workspace new ${env}

terraform destroy ${terraform_options}
