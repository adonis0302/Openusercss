#!/bin/echo This file must be sourced:
set -ex
export PATH=$PATH":repo/node_modules/.bin:node_modules/.bin"
export BOOTSTRAP=true
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

yarn_install () {
  COVERALLS_REPO_TOKEN="" yarn \
    --silent \
    --frozen-lockfile \
    --non-interactive \
    --network-timeout 10000 \
    --network-concurrency 3 \
    --production=false
}

in_repo () {
  cp .dev.env.default .dev.env
  cp .prod.env.default .prod.env

  yarn_install
}

prepare () {
  install_packages git $@
  print_details

  if [ -d "pr" ]; then
    cd pr
    echo COVERALLS_REPO_TOKEN=\"\" >> .dev.env.default
    echo COVERALLS_REPO_TOKEN=\"\" >> .prod.env.default

    in_repo
    cd -
  fi

  if [ -d "repo" ]; then
    cd repo
    in_repo
    cd -
  fi
}

dependencies () {
  prepare $@
}
