/* eslint no-console:0 */
import 'babel-polyfill'
import FpsEmitter from 'fps-emitter'
import {divide, sum} from 'lodash'
import log from 'chalk-console'
import iziToast from 'izitoast'

import VueModal from 'vue-js-modal'
import VFlickity from 'vue-flickity'
import {
  Vue,
  store,
  router,
  appBase
} from './vue'
import db from './store/db'
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
  process.db = db

  Vue.prototype.$toast = iziToast
  Vue.prototype.$db = db

  Vue.use(VueModal)
  Vue.component('flickity', VFlickity)

  const app = new Vue({
    store,
    router,
    ...appBase
  })

  process.toast = iziToast
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
    await window.addEventListener('load', async () => {
      try {
        await navigator.serviceWorker.register('/worker.js')
      } catch (error) {
        log.error(error)
      }
    })
  }
}

main()
window.process = process
