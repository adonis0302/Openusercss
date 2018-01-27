#!/bin/sh
source repo/ci/scripts/bootstrap.sh
dependencies git

npm run test:unit
