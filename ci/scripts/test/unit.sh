#!/bin/sh
source repo/ci/scripts/bootstrap.sh
prepare

npm run test:unit
