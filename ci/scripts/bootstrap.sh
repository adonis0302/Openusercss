#!/bin/echo This file must be sourced:
set -e
PATH=$PATH":repo/node_modules/.bin:node_modules/.bin"

print_details() {
  ls -a repo
  uname -nrom
  date
  pwd
  yarn --version
  npm --version
  node --version
  git --version
  busybox --help | head -1
  echo $NODE_ENV
  whoami
  cat /etc/*-release
}

install_packages() {
  apk --update add $@ --no-progress
}

prepare() {
  install_packages git
  print_details

  cd repo

  yarn \
    --silent \
    --frozen-lockfile \
    --non-interactive \
    --network-timeout 10000 \
    --network-concurrency 3 \
    --production=false \
    --no-progress
}

dependencies() {
  install_packages $@
  prepare
}
