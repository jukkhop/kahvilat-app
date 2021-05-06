#!/bin/bash

set -euo pipefail

cd "$(dirname "$0")"

yarn format
yarn lint
yarn test
