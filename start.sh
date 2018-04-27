#!/bin/bash
set -e

PATH=$PATH":node_modules/.bin:.ignored/bin"
CLEANUP_NEEDED=false

################################################################################
## Functions
################################################################################

info_prev_length=0

info () {
  content=$1
  expect_sameline=$2
  carriage="\\n"


  if [ $info_prev_length -gt 0 ]; then
    for (( i=1; i <= $info_prev_length + 7; i++)); do
  		printf " "
  	done

    printf "\\r"
    info_prev_length=0
  fi

  if [ ! -z "$expect_sameline" ]; then
    carriage="\\r"
    info_prev_length=${#content}
  fi

  printf "[INFO] %s$carriage" "$content"
}

cleanup () {
  info "Removing development domains from hosts file"
  sudo hostess del dev.openusercss.local
  sudo hostess del api.dev.openusercss.local

  wait
}

error () {
  msg=$1
  code=$2

  if [ ! -z "$code" ]; then
    printf "\\n[ERROR] Mayday, mayday, mayday!\\n"

    if $CLEANUP_NEEDED; then
      CLEANUP_NEEDED=false
      cleanup || error "Cleanup failed"
    fi

    printf "\\n[ERROR] %s\\n\\n" "$msg"
    exit "$code"
  else
    printf "[ERROR] %s\\n" "$msg"
  fi
}

check_binary () {
  bin=$1
  test=$2
  url=$3

  info "Checking $bin..." true

  if [ -z "$test" ]; then
    error "Test parameters for $bin are not specified. This is a developer error, please open an issue!" 1
  fi

  if [ ! -z "$bin" ]; then
    if ! type "$bin" > /dev/null 2> /dev/null; then
      if [ ! -z "$url" ]; then
        info "Binary $bin is not available in \$PATH."
        info "Download URL available, receiving from $url"

        wget \
          -r \
          -q \
          --tries=3 \
          -nc \
          --progress=bar \
          --show-progress \
          -U "OpenUserCSS startscript v$VERSION (github.com/OpenUserCSS/openusercss.org)" \
          -O .ignored/bin/"$bin" \
          "$url"

        chmod +x .ignored/bin/"$bin"
      else
        error "$bin is not available in \$PATH" 1
      fi
    fi
  fi

  command=$(printf "%s" "$test" | cut -d '#' -f1)
  expected=$(printf "%s" "$test" | cut -d '#' -f2)

  output=$($command)
  outputstatus=$?

  if [[ ! "$output" = *"$expected"* ]]; then
    printf "\\n"
    error "Expected $expected"
    error "Got      $output"
    error "Test output of binary \"$bin\" is not valid." 1
  fi

  if [ $outputstatus -gt 0 ]; then
    error "Error while testing $bin"
    error "Command $command returned error code $outputstatus" $outputstatus
  fi

  info "$bin is suitable"
}

check_env () {
  if [ "$(id -u)" = 0 ]; then
    error "This script must _not_ be run as root." 1
  fi

  while read -r line; do
    bin=$(printf "%s" "$line" | cut -d ';' -f1)
    test=$(printf "%s" "$line" | cut -s -d ';' -f2)
    url=$(printf "%s" "$line" | cut -s -d ';' -f3)

    check_binary "$bin" "$test" "$url"
  done < script_requirements.txt

  set +e
  docker info > /dev/null
  dockerstatus=$?
  set -e

  if [ $dockerstatus -gt 0 ]; then
    error "The Docker daemon is either not running, or $(whoami) has no access to it" $dockerstatus
  fi

  info "Preflight inspection complete."
}

keep_root () {
  if $CLEANUP_NEEDED; then
    while true; do
      info "Refreshing sudo session"

      sudo -n true
      kill -0 "$$" 2>/dev/null || error "Sudo session lost" 1
      sleep 300
    done &
  fi
}

initialise () {
  info "Starting before-takeoff checklist"
  check_env

  info "Adding development domains to hosts file"

  set +e
  trap - INT
  sudo printf "[INFO] Sudo session initialised\n"
  sudostatus=$?
  trap 'error "CTRL+C pressed" 1' INT
  set -e

  if [ $sudostatus -gt 0 ]; then
    error "Root access not granted. You must manually add the following entries:"
    error "127.0.0.1 dev.openusercss.local"
    error "127.0.0.1 api.dev.openusercss.local"
    info "Add them, then press ENTER to continue"
    read
  else
    sudo hostess add dev.openusercss.local 127.0.0.1
    sudo hostess add api.dev.openusercss.local 127.0.0.1

    CLEANUP_NEEDED=true
  fi

  hostsfile=$(cat /etc/hosts)

  if [[ ! "$hostsfile" = *"dev.openusercss.local"* ]] \
     || [[ ! "$hostsfile" = *"api.dev.openusercss.local"* ]]; then
    printf "\\n"
    error "Can't find development hosts in /etc/hosts"
    error "Hosts file test failed" 1
  fi

  info "Before-takeoff checklist complete"
}

countdown () {
  target=$1
  message=$2

  for (( target; $target >= 1; target-- )); do
		info "[$target]" true
    sleep 1
	done

  info "$message"
}

################################################################################
## Main
################################################################################

trap 'error "CTRL+C pressed" 1' INT
initialise

countdown 3 "Takeoff"

SHORT=$(git rev-parse --short HEAD)
TAG=$(git describe --always --tag --abbrev=0)

printf "\\n"
info "OpenUserCSS startscript $TAG ($SHORT)"
keep_root

info "Rotate"
docker-compose -f dev.stack.yml build || error "Building the stack image failed" 1

countdown 2 "Gear up"

docker-compose -f dev.stack.yml run --rm dev.openusercss || error \
  "A runtime error occurred - There is likely additional logging output above" 1

cleanup
