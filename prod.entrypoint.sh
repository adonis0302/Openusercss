#!/bin/ash
# shellcheck shell=dash
set -ex

cd /ouc
NODE_ENV=production node build/main.js
