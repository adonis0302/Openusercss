#!/bin/sh
source repo/ci/scripts/bootstrap.sh
dependencies openjdk8-jre

npm run test:e2e
