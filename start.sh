#!/bin/bash
set -e

################################################################################
## Variables
################################################################################

PATH=$PATH":node_modules/.bin:.ignored/bin"
CLEANUP_NEEDED=false
LOG_FILE=.ignored/logs/preflight.log
LOG_DIR=$(echo $LOG_FILE | rev | cut -d '/' -f2- | rev)
SHORT=$(git rev-parse --short HEAD)
TAG=$(git describe --always --tag --abbrev=0)
AGENT="OpenUserCSS startscript v$TAG (github.com/OpenUserCSS/openusercss.org)"
TRACE=false
ERROR_HANDLING=false

RED='\033[0;31m'
ORANGE='\033[0;33m'
CYAN='\033[0;36m'
RESET='\033[0m'

################################################################################
## Argument parsing and usage hints
################################################################################

usage_example () {
  printf '%15s\t%-s\n' "$1" "$2"
}

usage () {
  printf "OpenUserCSS development startup script version %s\n" "$TAG"
  printf "Usage: ./start.sh\n"
  printf "\n"
  usage_example "-h --help" "Shows this help message"
  usage_example "-t --trace" "Enables verbose logging to file"
  printf ""
}

while [ "$1" != "" ]; do
  PARAM=`echo $1 | awk -F= '{print $1}'`
  VALUE=`echo $1 | awk -F= '{print $2}'`
  case $PARAM in
    -h | --help)
      usage
      exit
      ;;
    -t | --trace)
      TRACE=true
      ;;
    -f | --file)
      LOG_FILE=$VALUE
      ;;
    *)
      printf "Unknown parameter \"$PARAM\"\n\n"
      usage
      exit 1
      ;;
  esac
  shift
done

################################################################################
## Logging
################################################################################

log () {
  tee /dev/fd/3
}

reset_file () {
  rm -f $1
  touch $1
}

newline () {
  printf "\\n" | tee /dev/fd/3
}

info () {
  local content=$1
  local expect_sameline=$2
  local carriage="\\n"
  local info_prev_length=0

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

  printf "$CYAN[INFO]$RESET %s$carriage" "$content" | log
}

################################################################################
## Error handling
################################################################################

error () {
  local msg=$1
  local code=$2

  if [ -z "$msg" ]; then
    printf "Error message _must_ be provided\n" | tee /dev/fd/3
    exit 1
  fi

  if [ ! -z "$code" ]; then
    newline
    remove_trap
    set -e

    printf "===========================\\n" | tee /dev/fd/3
    printf "| Mayday, mayday, mayday! |\\n" | tee /dev/fd/3
    printf "===========================\\n" | tee /dev/fd/3

    system_info

    if $CLEANUP_NEEDED; then
      CLEANUP_NEEDED=false
      cleanup || printf "Cleanup failed\n"
    fi

    printf "\\n$RED[ERROR]$RESET %s\\n" "$msg" | tee /dev/fd/3

    print_trace
    newline

    if [ "$TRACE" = false ]; then
      error "Detailed tracing was not enabled for this run. To get the most help,"
      error "please re-run this script with $0 -t and submit that one."
      newline
    fi

    printf "You can help fix this error if you want by sharing your logs with me.\n" 1>&3
    printf "Upload script logs (size: %s) to https://termbin.com? (y/N) " "$(du -ah $LOG_FILE | cut -f1)" 1>&3

    read -n 1 upload

    newline
    if [[ $upload =~ ^[Yy]$ ]]; then
      upload_logfile
    fi

    exit "$code"
  else
    printf "$ORANGE[WARN]$RESET %s\\n" "$msg" | tee /dev/fd/3
  fi
}

create_trap () {
  if [ "$ERROR_HANDLING" = false ]; then
    info "Error handling enabled"
    trap 'error "An error occurred on line $LINENO" 1' INT ERR TERM
    ERROR_HANDLING=true
  fi
}

remove_trap () {
  if [ "$ERROR_HANDLING" = true ]; then
    info "Error handling disabled"
    trap - INT ERR TERM
    ERROR_HANDLING=false
  fi
}

print_trace () {
  local TRACE_TEXT=""
  local CP=$$

  while true
  do
    local CMDLINE
    local PP
    local TRACE_TEXT="$TRACE_TEXT [$CP]:$CMDLINE\n"

    CMDLINE=$(cat /proc/$CP/cmdline | tr -d '\0')
    PP=$(grep PPid /proc/$CP/status | awk '{ print $2; }')
    if [ "$CP" = "1" ]; then
      break
    fi
    CP=$PP
  done

  echo | tee /dev/fd/3
  echo "Backtrace of '$0'" | tee /dev/fd/3
  printf "$TRACE_TEXT" | tac | grep -n ":" | tee /dev/fd/3
}

upload_logfile () {
  info "Uploading, please wait..." true
  upload_result=$(cat $LOG_FILE | nc termbin.com 9999 | tr -d '\0')

  info "Uploaded logs available at $upload_result"
}

system_info () {
  info "System info:"
  info "Operating system: $(uname -o)"
  info "Kernel: $(uname -s)"
  info "Release: $(uname -r)"
  info "Version: $(uname -v)"
  info "Processor: $(uname -p)"
  info "Platform: $(uname -i)"
  newline
  info "/etc/*-release: $(cat /etc/*-release)"
}

################################################################################
## Script lifecycle
################################################################################

cleanup () {
  info "Removing development domains from hosts file"
  sudo hostess del dev.openusercss.local | log
  sudo hostess del api.dev.openusercss.local | log

  info "Stopping and deleting containers"
  docker-compose -f dev.stack.yml down 2>&1 | log

  local jobcount
  jobcount=$(jobs -p | wc -l)

  if [ $jobcount -gt 0 ]; then
    info "Stopping $(jobs -p | wc -l) background tasks"
    kill "$(jobs -p)" | log
  else
    info "No background tasks remaining"
  fi
}

print_self () {
  cat $0
}

initialise () {
  mkdir -p "$LOG_DIR" build/data
  reset_file $LOG_FILE
  exec 3>&1 2>&1 1>>${LOG_FILE}

  if [ "$TRACE" = true ]; then
    exec {BASH_XTRACEFD}>>$LOG_FILE
    PS4='${BASH_LINENO[0]} - ${FUNCNAME[0]}() +'
    set -o xtrace
  fi

  info "OpenUserCSS startscript $TAG ($SHORT) on $(date "+%Y.%m.%d - %H:%M.%S")"
  create_trap

  info "Starting before-takeoff checklist"
  check_env

  info "Adding development domains to hosts file"

  sudo printf "$CYAN[INFO]$RESET Sudo session initialised\n" | tee /dev/fd/3
  local sudostatus=$?

  if [ $sudostatus -gt 0 ]; then
    info "Root access not granted. You must manually add the following entries:"
    info "127.0.0.1 dev.openusercss.local"
    info "127.0.0.1 api.dev.openusercss.local"
    info "Add them, then press ENTER to continue"
    read
  else
    sudo hostess add dev.openusercss.local 127.0.0.1 | log
    sudo hostess add api.dev.openusercss.local 127.0.0.1 | log

    CLEANUP_NEEDED=true
  fi

  local hostsfile
  hostsfile=$(cat /etc/hosts)

  if [[ ! "$hostsfile" = *"dev.openusercss.local"* ]] \
     || [[ ! "$hostsfile" = *"api.dev.openusercss.local"* ]]; then
    newline
    error "Can't find development hosts in /etc/hosts"
    error "Hosts file test failed" 1
  fi

  info "Before-takeoff checklist complete"
}

################################################################################
## Environment checking
################################################################################

check_binary () {
  local bin=$1
  local test=$2
  local url=$3
  local postprocess=$4
  local installed=true

  if [ -z "$test" ]; then
    error "Test parameters for $bin are not specified. This is a developer error, please open an issue!" 1
  fi

  if [ ! -z "$bin" ]; then
    if ! type "$bin" > /dev/null 2> /dev/null; then
      if [ ! -z "$url" ]; then
        info "Binary $bin is not available in \$PATH."
        info "Download URL available, receiving..."

        if [ -z "$postprocess" ]; then
          wget \
            -r \
            -q \
            --tries=3 \
            -nc \
            --progress=bar \
            --show-progress \
            -U $AGENT \
            -O .ignored/bin/"$bin" \
            "$url" | log
        else
          # This is not in use currently. If a downloadable binary every requires
          # post-processing, this is where that code goes
          wget \
            -r \
            -q \
            --tries=3 \
            -nc \
            --progress=bar \
            --show-progress \
            -U $AGENT \
            -O .ignored/temp/"$bin" \
            "$url" | log
        fi

        chmod +x .ignored/bin/"$bin" | log
      else
        # error "$bin is not available in \$PATH" 1
        installed=false
      fi
    fi
  else
    error "A binary has not been properly specified. This is a developer error, please open an issue!"
    error "Line: $*" 1
  fi

  local command
  local expected
  local output
  local outputstatus

  command=$(printf "%s" "$test" | cut -d '#' -f1)
  expected=$(printf "%s" "$test" | cut -d '#' -f2)

  set +e
  output=$(sh -c "$command" 2>&1)
  outputstatus=$?
  set -e

  local prefix="[✔]"
  local suffix="suitable"
  local colour=$CYAN
  local success=true

  if [[ ! "$output" = *"$expected"* ]] || [ "$installed" = false ]; then
    prefix="[✘]"
    suffix="foul"
    colour=$RED
    success=false
  fi

  if [ $outputstatus -gt 0 ]; then
    error "Error while testing $bin:"
    error "$output"
    error "Command $command returned error code $outputstatus" $outputstatus
    colour=$RED
    success=false
    return
  fi

  printf "${colour}%s${RESET} %15s\t%-s\n" $prefix $bin $suffix | log

  if [ "$success" = false ]; then
    all_bin_result=false
    printf "============================================================\n" | log
    printf "%-30s\t%-30s\\n" "Exptected text to include:" "Got:" | log
    diff <(echo $expected) <(echo $output) -dy -W 60 | log
    printf "============================================================\n" | log
  fi

  if [ "$installed" = false ]; then
    error "$bin is not available in \$PATH" 1
  fi
}

check_env () {
  if [ "$(id -u)" = 0 ]; then
    error "This script must _not_ be run as root." 1
  fi

  all_bin_result=true

  while read -r line; do
    local bin
    local test
    local url
    local postprocess

    bin=$(printf "%s" "$line" | cut -d ';' -f1)
    test=$(printf "%s" "$line" | cut -s -d ';' -f2)
    url=$(printf "%s" "$line" | cut -s -d ';' -f3)
    postprocess=$(printf "%s" "$line" | cut -s -d ';' -f4)

    check_binary "$bin" "$test" "$url" "$postprocess"
  done < script_requirements.txt

  if [ "$all_bin_result" = false ]; then
    error "Failed to validate one or more binaries" 1
  fi

  set +e
  docker info > /dev/null
  dockerstatus=$?
  set -e

  if [ $dockerstatus -gt 0 ]; then
    error "The Docker daemon is either not running, or $(whoami) has no access to it" $dockerstatus
  fi

  info "Preflight inspection complete."
}

################################################################################
## Utility
################################################################################

countdown () {
  local target=$1
  local message=$2

  for (( target; $target >= 1; target-- )); do
		info "[$target]" true
    sleep 1
	done

  info "$message"
}

################################################################################
## Main
################################################################################

initialise
countdown 2 "Takeoff"

info "Rotate"
docker-compose -f dev.stack.yml build | tee /dev/fd/3 || error "Building the stack image failed" 1

countdown 2 "Gear up"

docker-compose -f dev.stack.yml run --rm dev.openusercss 2>&1 | log || error \
  "A runtime error occurred - There is likely additional logging output above" 1

cleanup
