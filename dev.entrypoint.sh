#!/bin/ash
set -ex

cd /ouc
npm rebuild node-sass
yarn --frozen-lockfile

yarn watch:v
