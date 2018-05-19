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

NODE_ENV=production node build/main.js
