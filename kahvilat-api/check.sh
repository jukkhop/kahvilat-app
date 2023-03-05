#!/bin/bash

set -euo pipefail

cd "$(dirname "$0")"

yarn format:check
yarn lint
yarn test
