/* eslint no-console:0 */

import log from 'chalk-console'

import {runPolyfills} from './utils/features'
import vue from './vue'

const scriptsStart = Date.now()
const perfStats = {
  'blocking': [],
  'sync':     [],
  'async':    []
}

const polyfills = async () => {
  const polyfillsStart = Date.now()
  const ranPolyfills = await runPolyfills()

  perfStats.sync.push({
    'name': 'polyfills',
    'time': Date.now() - polyfillsStart
  })
  return ranPolyfills
}

(async () => {
  const polyfillsResult = await polyfills()

  vue()
  log.info(`Needed polyfills on this browser: ${JSON.stringify(polyfillsResult, null, 4)}`)

  return true
})()

perfStats.blocking.push({
  'name': 'mainThread',
  'time': Date.now() - scriptsStart
})
