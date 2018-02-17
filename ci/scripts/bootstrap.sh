#!/bin/echo This file must be sourced:
set -ex
export PATH=$PATH":repo/node_modules/.bin:node_modules/.bin"
export BOOTSTRAP=true
export GIT_DISCOVERY_ACROSS_FILESYSTEM=true
export BUILD_START=$(date +%s)
export BUILD_PATH=$(pwd)

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
}

install_packages () {
  apk --update add $@ --no-progress
}

in_repo () {
  cp .dev.env.default .dev.env
  cp .prod.env.default .prod.env

  echo COVERALLS_REPO_TOKEN=\"\" >> .dev.env
  echo COVERALLS_REPO_TOKEN=\"\" >> .prod.env

  env-cmd .dev.env yarn \
    --silent \
    --frozen-lockfile \
    --non-interactive \
    --network-timeout 10000 \
    --network-concurrency 3 \
    --production=false
}

prepare () {
  COVERALLS_REPO_TOKEN="" yarn global add env-cmd \
    --silent \
    --frozen-lockfile \
    --non-interactive \
    --network-timeout 10000 \
    --network-concurrency 3 \
    --production=false

  install_packages git $@
  print_details

  if [ -d "pr" ]; then
    cd pr
    git status || error "Not a git repository"
    in_repo
    cd -
  fi

  if [ -d "repo" ]; then
    cd repo
    git status || error "Not a git repository"
    in_repo
    cd -
  fi
}

dependencies () {
  prepare $@
}
