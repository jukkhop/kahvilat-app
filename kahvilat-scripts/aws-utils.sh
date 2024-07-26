#!/usr/bin/env bash
set -e

function get_redis_endpoint_address {
  local ADDRESS="$( \
    aws elasticache describe-cache-clusters \
      --cache-cluster-id ${1} \
      --show-cache-node-info \
      --query 'CacheClusters[*].CacheNodes[*].[Endpoint.Address]' \
      --output text
  )"

  echo "$ADDRESS"
}

function get_redis_endpoint_port {
  local PORT="$( \
    aws elasticache describe-cache-clusters \
      --cache-cluster-id ${1} \
      --show-cache-node-info \
      --query 'CacheClusters[*].CacheNodes[*].[Endpoint.Port]' \
      --output text
  )"

  echo "$PORT"
}

function get_cloudfront_distribution_id {
  local DISTRIBUTION_ID="$( \
    aws cloudfront list-distributions \
    --query 'DistributionList.Items[*].{id:Id,origin:Origins.Items[0].Id}[?origin=='"'"${1}"'"'].id' \
    --output text
  )"

  echo "$DISTRIBUTION_ID"
}

function get_security_group_id {
  local GROUP_ID="$( \
    aws ec2 describe-security-groups \
    --filters Name=group-name,Values=${1} \
    --query 'SecurityGroups[*].GroupId' \
    --output text
  )"

  echo "$GROUP_ID"
}

function get_subnet_id {
  local SUBNET_ID="$( \
    aws ec2 describe-subnets \
    --filters Name=tag:Name,Values=${1} \
    --query 'Subnets[*].SubnetId' \
    --output text
  )"

  echo "$SUBNET_ID"
}
