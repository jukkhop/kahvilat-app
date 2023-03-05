#!/bin/bash

set -euo pipefail

cd "$(dirname "$0")"

npm run format
npm run lint
npm test
