#!/bin/echo This file must be sourced:
set -e
PATH=$PATH":repo/node_modules/.bin:node_modules/.bin"
export GIT_DISCOVERY_ACROSS_FILESYSTEM=true

error () {
  echo "$@"
  exit 1
}

print_details () {
  ls -a .
  uname -nrom
  date
  pwd
  yarn --version || error "yarn isn't installed"
  npm --version || error "npm isn't installed"
  node --version || error "node.js isn't installed"
  git --version || error "git isn't installed"
  busybox --help | head -1 || error "Busybox isn't installed"
  echo "NODE_ENV:" $NODE_ENV
  whoami
  cat /etc/*-release || error "Failed to read distribution release file"
  git status || error "Not a git repository"
}

install_packages () {
  apk --update add $@ --no-progress
}

prepare () {
  cd repo
  cp .dev.env.default .dev.env
  cp .prod.env.default .prod.env

  install_packages git $@
  print_details

  yarn \
    --silent \
    --frozen-lockfile \
    --non-interactive \
    --network-timeout 10000 \
    --network-concurrency 3 \
    --production=false
}

dependencies () {
  prepare $@
}
