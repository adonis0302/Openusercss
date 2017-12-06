/* eslint no-console:0 */
import 'babel-polyfill'
import FpsEmitter from 'fps-emitter'
import {divide, sum} from 'lodash'

import VModal from 'vue-js-modal'
import {
  Vue,
  store,
  router,
  appBase
} from './vue'

import {runPolyfills} from './utils/features'

const polyfills = async () => {
  return runPolyfills()
}

const main = async () => {
  const polyfillsResult = await polyfills()
  const fps = new FpsEmitter(1000)

  process.animating = []
  process.averageFps = 0
  process.fpsHistory = []
  process.polyfills = polyfillsResult

  Vue.use(VModal)

  const app = new Vue({
    store,
    router,
    ...appBase
  })

  process.nextTick(() => {
    app.$mount('app')
  })

  window.addEventListener('load', () => {
    process.nextTick(() => {
      fps.on('update', (newFps) => {
        if (process.animating.length > 0 || process.averageFps < 45) {
          process.fpsHistory.unshift(newFps)
        }

        if (process.fpsHistory.length > 9) {
          process.fpsHistory.splice(-1, 1)
        }

        process.averageFps = Math.floor(divide(sum(process.fpsHistory), process.fpsHistory.length))
      })
    })
  })

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/worker.js')
    })
  }
}

main()
window.process = process
