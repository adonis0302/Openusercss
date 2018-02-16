#!/bin/echo This file must be sourced:
set -ex
export PATH=$PATH":repo/node_modules/.bin:node_modules/.bin"
export BOOTSTRAP=true
export GIT_DISCOVERY_ACROSS_FILESYSTEM=true
export BUILD_START=$(date +%s)

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

yarn () {
  yarn \
    --silent \
    --frozen-lockfile \
    --non-interactive \
    --network-timeout 10000 \
    --network-concurrency 3 \
    --production=false \
    $@
}

in_repo () {
  cp .dev.env.default .dev.env
  cp .prod.env.default .prod.env

  echo COVERALLS_REPO_TOKEN=\"\" >> .dev.env
  echo COVERALLS_REPO_TOKEN=\"\" >> .prod.env

  env-cmd .dev.env yarn
}

prepare () {
  COVERALLS_REPO_TOKEN="" yarn global add env-cmd

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

prepare_comment () {
  # $1: comment step
  # - approve
  # - test
  # $2: comment type
  # - success
  # - failed
  # $3: finished date
  # $4: comment extra - optional

  cp repo/ci/messages messages

  case $1 in
    "approve") ;;
    "test") ;;
    *) error 'First argument for prepare_comment must be one of ["approve", "test"]'
  esac

  case $2 in
    "success") ;;
    "failed") ;;
    *) error 'Second argument for prepare_comment must be one of ["success", "failed"]'
  esac

  if [ $3 =~ '^[0-9]+$' ]; then
    error 'Third argument for prepare_comment must be a number (use `date +%s`)'
  fi

  echo "Time: **$(($3 - $BUILD_START)) seconds**  \n$4" >> "messages/$1-$2.md"
}

dependencies () {
  prepare $@
}
