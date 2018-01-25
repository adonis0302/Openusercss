/* eslint no-console:0 */
import 'babel-polyfill'
import FpsEmitter from 'fps-emitter'
import {divide, sum,} from 'lodash'
import log from 'chalk-console'
import iziToast from 'izitoast'
import raven from 'raven-js'
import {StarRating,} from 'vue-rate-it'
import ravenVue from 'raven-js/plugins/vue'

import VueModal from 'vue-js-modal'
import VueFlickity from 'vue-flickity'
import {
  Vue,
  store,
  router,
  appBase,
} from './utils/vue'
import db from './store/db'
import {runPolyfills,} from './utils/features'
import {runIntegration,} from './utils/extension-hook'

if (process.env.NODE_ENV !== 'development') {
  raven.config('https://37715e4819864017ba7c02d05eb5cb75@sentry.io/264718', {
    'release': window.revision.revisionLong,
  })
  .addPlugin(ravenVue, Vue)
  .install()
  .setTagsContext(window.revision)
}

const polyfills = async () => {
  return runPolyfills()
}

const mountApp = async () => {
  const app = new Vue({
    store,
    router,
    ...appBase,
  })

  app.$mount('app')
  return true
}

const main = async () => {
  const polyfillsResult = await polyfills()

  process.animating = []
  process.averageFps = 0
  process.fpsHistory = []
  process.polyfills = polyfillsResult
  process.db = db
  process.extension = null

  Vue.prototype.$toast = iziToast
  Vue.prototype.$db = db

  Vue.use(VueModal)
  Vue.component('flickity', VueFlickity)
  Vue.component('star-rating', StarRating)

  runIntegration()
  await mountApp()

  const fps = new FpsEmitter(1000)

  window.addEventListener('load', () => {
    fps.on('update', (newFps) => {
      if (process.animating.length > 0 || process.averageFps < 45) {
        process.fpsHistory.unshift(newFps)
      }

      if (process.fpsHistory.length > 9) {
        process.fpsHistory.splice(-1, 1)
      }

      process.averageFps = Math.floor(divide(sum(process.fpsHistory), process.fpsHistory.length))

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/worker.js')
        .catch((error) => {
          log.error(error)
          raven.captureException(error)
        })
      }
    })
  })
}

main()
.catch((error) => {
  console.error(error)
  raven.captureException(error)
})

window.process = process
