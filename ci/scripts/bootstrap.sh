#!/bin/echo This file must be sourced:
set -e
PATH=$PATH":repo/node_modules/.bin:node_modules/.bin"

print_details() {
  echo
  echo '=========================================================='
  echo 'ls: '
  ls repo

  echo
  if [ -d "npm-repo-cache/node_modules" ]; then
    printf 'Cached node_modules size: '
    du -sh npm-repo-cache/node_modules
  else
    echo "Module cache not found, yarn will rebuild."
    echo "Cache contents:"
    ls npm-repo-cache
  fi

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

install_packages() {
  echo
  echo "Installing package(s):" "$@"
  apk --update add $@ --no-progress
}

prepare() {
  install_packages git

  echo "Linking cached node_modules to repository"
  ln -s npm-repo-cache/node_modules repo/node_modules
  print_details

  cd repo

  yarn \
    --silent \
    --frozen-lockfile \
    --non-interactive \
    --modules-folder npm-repo-cache/node_modules \
    --network-timeout 10000 \
    --network-concurrency 3 \
    --production=false \
    --no-progress
}

dependencies() {
  install_packages $@
  prepare
}
