#!/bin/ash
# shellcheck shell=dash
set -ex

cd /ouc
./node_modules/.bin/env-cmd .env node build/main.js
