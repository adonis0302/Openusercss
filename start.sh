#!/bin/sh
set -e

if [ $(id -u) = 0 ]; then
  printf "Refusing to run as root.\n"
  printf "You must use a non-privileged account.\n"
  exit 1
fi

printf "Please manually confirm that the following conditions are met:\n\n"

printf " - The following are installed:\n"
printf " \t- Docker\n"
printf " \t- docker-compose\n"
printf "\n"

printf " - The following binaries are available in \$PATH:\n"
printf " \t- docker-compose\n"
printf " \t- curl\n"
printf " \t- cp\n"
printf "\n"

printf "The Docker daemon is running and user '$(whoami)' has permissions to use it\n"

read -p "Confirm? (y/N) " -n 1 suitable
printf "\n"

if [[ ! $suitable =~ ^[Yy]$ ]]; then
    exit 1
fi

function setup_files () {
  if [ ! -f .dev.env ]; then
    printf "Copying .dev.env.default\n"
    cp .dev.env.default .dev.env
  fi

  if [ ! -f .prod.env ]; then
    printf "Copying .prod.env.default\n"
    # cp .dev.env.default .dev.env
  fi
}

function add_hosts () {
  printf "Adding development domains to hosts file\n"
  sudo hostess add dev.openusercss.local 127.0.0.1
  sudo hostess add api.dev.openusercss.local 127.0.0.1
}

function remove_hosts () {
  printf "Removing development domains from hosts file\n"
  sudo hostess del dev.openusercss.local
  sudo hostess del api.dev.openusercss.local
}

function error () {
  printf "An error occurred. There is likely more information above.\n"
  printf "Details:\n"$@"\n"
  remove_hosts
  exit 1
}

function update_hosts_cli () {
  printf "Updating hostess\n"
  mkdir -p .ignored/bin

  curl -L https://github.com/cbednarski/hostess/releases/download/v0.3.0/hostess_linux_amd64 -o .ignored/bin/hostess
  chmod +x .ignored/bin/hostess
}

if [ ! -x ".ignored/bin/hostess" ]; then
  printf "Hostess binary missing or not executable. Redownloading...\n"
  update_hosts_cli
fi

setup_files

PATH=$PATH":node_modules/.bin:.ignored/bin"
add_hosts || (update_hosts_cli && add_hosts)

printf "Building stack...\n"
docker-compose -f dev.stack.yml build || error "Building the stack image failed"

printf "Booting...\n"
docker-compose -f dev.stack.yml run --rm dev.openusercss || error "A runtime error occurred"

remove_hosts
