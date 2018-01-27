#!/bin/sh
source repo/ci/scripts/bootstrap.sh
dependencies git

npm run build:fast
