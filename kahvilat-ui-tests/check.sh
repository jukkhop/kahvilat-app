#!/usr/bin/env bash

set -e

cd $(dirname $0)

npm install
npm run format
npm run lint
