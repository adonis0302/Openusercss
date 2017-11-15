/* eslint no-console:0 */
import 'babel-polyfill'
import log from 'chalk-console'
import FpsEmitter from 'fps-emitter'
import {app} from './vue'

import {runPolyfills} from './utils/features'

const polyfills = async () => {
  return runPolyfills()
}

const main = async () => {
  const polyfillsResult = await polyfills()

  app.$mount('app')
  if (polyfillsResult.length !== 0) {
    log.info(`Needed polyfills on this browser: ${JSON.stringify(polyfillsResult, null, 4)}`)
  }

  const fps = new FpsEmitter(1000)

  fps.on('update', (newFps) => {
    process.fps = newFps
  })

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/worker.js')
    })
  }

  process.animations = true
}

main()
