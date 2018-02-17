#!/bin/sh
source repo/ci/scripts/bootstrap.sh

dependencies mongodb
mkdir -p /data/db
/usr/bin/mongod --quiet --syslog --noauth --fork

if [ -z "$(ls -A pr)" ]; then
  cd pr
else
  cd repo
fi

env-cmd .dev.env npm run test:ci
nyc report --reporter=text-lcov | coveralls

cd -
