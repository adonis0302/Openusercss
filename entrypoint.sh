#!/bin/ash
set -e

cd /ouc

if [ $1 = "install" ]; then
  npm i --only=production
else
  npm i --only=production
  NODE_ENV=production node manager.js
fi
