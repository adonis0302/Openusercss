#!/bin/ash
# shellcheck shell=dash
set -ex

cd /ouc
yarn \
  --frozen-lockfile \
  --non-interactive \
  --network-timeout 10000 \
  --network-concurrency 3 \
  --production \
  --cache-folder /yarn-cache

./node_modules/.bin/env-cmd .env node build/main.js
