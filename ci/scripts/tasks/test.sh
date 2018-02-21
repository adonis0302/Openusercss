#!/bin/sh
source ../bootstrap.sh

dependencies mongodb
mkdir -p /data/db
/usr/bin/mongod --quiet --syslog --noauth --fork

cd pr || cd repo || error "Neither repo or pr inputs exist"

env-cmd .dev.env npm run test:ci
nyc report --reporter=text-lcov | coveralls
