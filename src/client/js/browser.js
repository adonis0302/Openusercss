/* eslint no-console:0 */
import 'babel-polyfill'
import log from 'chalk-console'
import FpsEmitter from 'fps-emitter'
import {app} from './vue'

let runPolyfills = () => {
  return []
}

if (document) {
  runPolyfills = require('./utils/features').runPolyfills
}

const polyfills = async () => {
  const ranPolyfills = await runPolyfills()

  return ranPolyfills
}

const main = async () => {
  const polyfillsResult = await polyfills()

  app.$mount('app')
  log.info(`Needed polyfills on this browser: ${JSON.stringify(polyfillsResult, null, 4)}`)
}

const fps = new FpsEmitter()

fps.on('update', (newFps) => {
  process.fps = newFps
})

main()
window.process = process
