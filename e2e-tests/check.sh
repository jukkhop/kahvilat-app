#!/bin/bash

set -euo pipefail

cd "$(dirname "$0")"

yarn install
yarn format
yarn lint
