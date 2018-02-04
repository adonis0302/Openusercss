#!/bin/echo This file must be sourced:
set -e
PATH=$PATH":repo/node_modules/.bin:node_modules/.bin"
export GIT_DISCOVERY_ACROSS_FILESYSTEM=true

exit_not_git() {
  echo "Not a git repository"
  exit 1
}

print_details() {
  ls -a .
  uname -nrom
  date
  pwd
  yarn --version
  npm --version
  node --version
  git --version
  busybox --help | head -1
  echo "NODE_ENV:" $NODE_ENV
  whoami
  cat /etc/*-release
  git status || exit_not_git
}

install_packages() {
  apk --update add $@ --no-progress
}

prepare() {
  cd repo

  install_packages git $@
  print_details

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
  prepare $@
}
