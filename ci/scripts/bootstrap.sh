#!/bin/echo This file must be sourced:
set -e
PATH=$PATH":repo/node_modules/.bin:node_modules/.bin"

print_details() {
  echo
  echo '=========================================================='
  uname -nrom

  printf 'Build date: '
  date

  printf 'Working directory: '
  pwd

  printf 'Yarn version: '
  yarn --version

  printf 'NPM version: '
  npm --version

  printf 'Node version: '
  node --version

  git --version
  busybox --help | head -1

  printf 'NODE_ENV: '
  echo $NODE_ENV

  printf 'User: '
  whoami

  echo '=========================================================='
  cat /etc/*-release

  echo '=========================================================='
  echo
}

prepare() {
  echo "Moving cached node_modules to repository"
  mv npm-repo-cache/node_modules repo/node_modules

  cd repo
  print_details

  yarn --frozen-lockfile --non-interactive
}

dependencies() {
  echo
  echo "Installing package(s):" "$@"
  apk --update add $@ --no-progress
  prepare
}
