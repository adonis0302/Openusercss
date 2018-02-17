#!/bin/sh
source repo/ci/scripts/bootstrap.sh
source repo/ci/scripts/approve.sh

dependencies python make g++ krb5-dev

if [ -z "$(ls -A pr)" ]; then
  cd pr
else
  cd repo
fi

approve_pre
env-cmd .dev.env npm run build:fast
approve_post

cd -
