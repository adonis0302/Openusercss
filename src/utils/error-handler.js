// @flow

import PrettyError from 'pretty-error'
import log from 'chalk-console'
const pe = new PrettyError()

pe.appendStyle({
  'pretty-error > header > title > kind': {
    'display': 'none'
  },
  'pretty-error > header > colon': {
    'display': 'none'
  },
  'pretty-error > header > message': {
    'color': 'red'
  },
  'pretty-error > trace > item > header > pointer > file': {
    'color': 'bright-cyan'
  },
  'pretty-error > trace > item > header > pointer > colon': {
    'color': 'cyan'
  },
  'pretty-error > trace > item > header > pointer > line': {
    'color': 'cyan'
  },
  'pretty-error > trace > item > header > what': {
    'color': 'bright-white'
  },
  'pretty-error > trace > item > footer > addr': {
    'color': 'white'
  }
})
pe.skipPackage('regenerator-runtime')
pe.skipNodeFiles()
pe.filter((traceLine) => {
  if (traceLine.shortenedAddr) {
    traceLine.shortenedAddr = traceLine.shortenedAddr.replace(process.cwd(), '')
  }
})

const handle = (error: Error) => {
  const rendered = pe.render(error)

  if (error.message) {
    log.error([error.message, rendered])
  } else {
    log.error(rendered)
  }
}

module.exports = {
  handle
}
