#!/bin/echo This file must be sourced:

if [ -z ${BOOTSTRAP+x} ]; then
  echo "bootstrap.sh must be run before approve.sh"
  exit 2
fi

# Built files
MAX_BUILD_SIZE=35000
MAX_BROWSERJS_SIZE_KB=6000
MAX_IMG_SIZE_KB=10000

# Source files
MAX_TOTAL_SRC_SIZE_KB=3000

# $1: name
# $2: total size
# $3: max allowed size
compare () {
  if [ $2 -ge $3 ]; then
      error "$1 size is above the maximum by $(($2 - $3))KB"
  else
      echo "$1 size is below maximum by $(($3 - $2))KB"
  fi
}

# Returns filesize in KB
fsize () {
  du -ck $@ | tail -1 | cut -f1 || error "One of $@ does not exist."
}

approve_pre () {
  cd src || error "src directory does not exist"
  ls -a .

  TOTAL_SRC_SIZE=$(fsize .)
  cd ..

  compare "source code" $TOTAL_SRC_SIZE $MAX_TOTAL_SRC_SIZE_KB
}

approve_post () {
  cd build || error "build directory does not exist"
  ls -a .

  TOTAL_BUILD_SIZE=$(fsize .)
  BROWSERJS_SIZE_FILE=$(fsize static/browser.js)
  IMG_SIZE_DIR=$(fsize static/img)
  cd ..

  compare "build" $TOTAL_BUILD_SIZE $MAX_BUILD_SIZE
  compare "browser.js" $BROWSERJS_SIZE_FILE $MAX_BROWSERJS_SIZE_KB
  compare "images" $IMG_SIZE_DIR $MAX_IMG_SIZE_KB
}
