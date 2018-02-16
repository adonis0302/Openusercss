#!/bin/sh
source ../bootstrap.sh
source ../approve.sh

dependencies python make g++ krb5-dev

cd pr || cd repo || error "Neither repo or pr inputs exist"

approve_pre
env-cmd .dev.env npm run build:fast
approve_post
