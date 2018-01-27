#!/bin/sh
source repo/ci/scripts/bootstrap.sh
dependencies git openjdk8-jre

npm run test:e2e
