#!/usr/bin/env bash
set -e

cd $(dirname $0)

npm run format
npm run lint
npm run typecheck
npm run test:unit
