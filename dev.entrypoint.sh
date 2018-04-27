#!/bin/ash
# shellcheck shell=dash
set -ex

cd /ouc
npm rebuild node-sass node-gyp
yarn --frozen-lockfile

yarn watch:v
