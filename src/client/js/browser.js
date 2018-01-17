/* eslint no-console:0 */
import 'babel-polyfill'
import FpsEmitter from 'fps-emitter'
import {divide, sum,} from 'lodash'
import log from 'chalk-console'
import iziToast from 'izitoast'
import raven from 'raven-js'
import {StarRating,} from 'vue-rate-it'
import ravenVue from 'raven-js/plugins/vue'
import hat from 'hat'
import {struct,} from 'superstruct'

import VueModal from 'vue-js-modal'
import VueFlickity from 'vue-flickity'
import {
  Vue,
  store,
  router,
  appBase,
  mixins,
} from './utils/vue'
import db from './store/db'
import {runPolyfills,} from './utils/features'

if (process.env.NODE_ENV !== 'development') {
  raven.config('https://37715e4819864017ba7c02d05eb5cb75@sentry.io/264718', {
    'release': window.revision.revisionLong,
  })
  .addPlugin(ravenVue, Vue)
  .install()
  .setTagsContext(window.revision)
}

const key = hat()
const responseValidator = struct({
  'type':      'string',
  'key':       'string',
  'extension': {
    'name':         'string',
    'version':      'string?',
    'capabilities': [
      'string?',
    ],
  },
})
const questionValidator = struct({
  'type':         'string',
  'key':          'string',
  'revision':     'object',
  'featuresList': {
    'required': [
      'string',
    ],
    'optional': [
      'string',
    ],
  },
})
const featuresList = {
  'required': [
    'install-usercss',
    'configure-after-install',
  ],
  'optional': [
    'install-usercss-event',
    'configure-before-install',
    'builtin-editor',
    'create-usercss',
    'edit-usercss',
    'import-moz-export',
    'export-moz-export',
    'update-manual',
    'update-auto',
    'export-json-backups',
    'import-json-backups',
    'manage-local',
    'search-remote',
    'query-api',
    'mutate-api',
  ],
}

const polyfills = async () => {
  return runPolyfills()
}
const sendHandshakeQuestion = () => {
  window.postMessage(questionValidator({
    'type':     'ouc-handshake-question',
    'revision': window.revision,
    featuresList,
    key,
  }), '*')
}
const attachHandshakeListeners = () => {
  window.addEventListener('message', (event) => {
    try {
      if (event.data && event.data.type === 'ouc-begin-handshake') {
        sendHandshakeQuestion()
      }

      if (event.data && event.data.type === 'ouc-handshake-response') {
        const response = responseValidator(event.data)
        const missingFeatures = []

        featuresList.required.forEach((feature) => {
          if (!response.extension.capabilities.includes(feature)) {
            missingFeatures.push(feature)
          }
        })

        if (missingFeatures.length) {
          throw new Error([
            `${response.extension.name} ${response.extension.version} is not capable of the following features:`,
            `${missingFeatures.join('\n')}`,
          ].join('\n'))
        }

        if (response.key !== key) {
          throw new Error([
            'Response key doesn\'t match.\n',
            `Expected: ${key}`,
            `Received: ${response.key}`,
            `Raw data: ${JSON.stringify(response, null, 2)}`,
          ].join('\n'))
        }

        process.extension = response.extension
      }
    } catch (error) {
      console.error(error)
    }
  })
}

const mountApp = async () => {
  const app = new Vue({
    store,
    router,
    mixins,
    ...appBase,
  })

  app.$mount('app')
  return true
}

const main = async () => {
  const polyfillsResult = await polyfills()

  attachHandshakeListeners()
  sendHandshakeQuestion()

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
    })
  })

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/worker.js')
      .catch((error) => {
        log.error(error)
        raven.captureException(error)
      })
    })
  }
}

main()
.catch((error) => {
  console.error(error)
  raven.captureException(error)
})

window.process = process
