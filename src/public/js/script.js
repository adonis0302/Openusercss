/* eslint no-console:0 */
import 'babel-polyfill'

import Vue from 'vue'
import VueRouter from 'vue-router'
import VeeValidate from 'vee-validate'
import VueApollo from 'vue-apollo'
import {store} from './store'

import {ApolloClient, createBatchingNetworkInterface} from 'apollo-client'
import anime from 'animejs'
import log from 'chalk-console'

import {runPolyfills} from './utils/features'

import appBase from '../../../.tmp/app-base/app-base.vue'
import indexRoute from '../../../.tmp/routes/index/index.vue'
import browseRoute from '../../../.tmp/routes/browse/browse.vue'
import loginRoute from '../../../.tmp/routes/login/login.vue'
import registerRoute from '../../../.tmp/routes/register/register.vue'

const scriptsStart = Date.now()
const perfTelemetry = {
  'blocking': [],
  'sync':     [],
  'async':    []
}

const polyfills = async () => {
  const polyfillsStart = Date.now()
  const ranPolyfills = await runPolyfills()

  perfTelemetry.sync.push({
    'name': 'polyfills',
    'time': Date.now() - polyfillsStart
  })
  return ranPolyfills
}

const removeLoadingIndicator = async () => {
  const indicatorStart = Date.now()
  const loadingIndicator = document.querySelector('.loading-indicator')
  const node = await anime({
    'targets':  loadingIndicator,
    'bottom':   '100%',
    'duration': 700,
    'easing':   'easeInQuart'
  })

  await node.finished

  loadingIndicator.remove()
  perfTelemetry.async.push({
    'name': 'indicator',
    'time': Date.now() - indicatorStart
  })

  return true
}

const vue = async () => {
  const vueStart = Date.now()
  const networkInterface = createBatchingNetworkInterface({
    'uri': '/graphql'
  })
  const apolloClient = new ApolloClient({
    networkInterface,
    'connectToDevTools':  true,
    'ssrForceFetchDelay': 100
  })

  Vue.use(VueApollo)
  Vue.use(VueRouter)
  Vue.use(VeeValidate, {
    'errorBagName':  'errors',
    'fieldsBagName': 'fields',
    'delay':         50,
    'locale':        'en',
    'dictionary':    null,
    'strict':        true,
    'classes':       false,
    'classNames':    {
      'touched':   'touched',
      'untouched': 'untouched',
      'valid':     'valid',
      'invalid':   'invalid',
      'pristine':  'pristine',
      'dirty':     'dirty'
    },
    'events':   'input|blur',
    'inject':   true,
    'validity': false,
    'aria':     true
  })

  const router = new VueRouter({
    'mode':   'history',
    'routes': [
      {
        'path':      '/',
        'component': indexRoute
      },
      {
        'path':      '/login',
        'component': loginRoute
      },
      {
        'path':      '/register',
        'component': registerRoute
      },
      {
        'path':      '/browse',
        'component': browseRoute
      }
    ]
  })

  const apolloProvider = new VueApollo({
    'defaultClient': apolloClient
  })

  const app = new Vue({
    store,
    apolloProvider,
    router,
    'el':     'app',
    'render': (handle) => handle(appBase)
  })

  document.querySelector('noscript').remove()

  perfTelemetry.sync.push({
    'name': 'vue',
    'time': Date.now() - vueStart
  })
  return app
}

const loadedFonts = async () => {
  const fontsStart = Date.now()
  const fontset = await document.fonts.ready
  const fontResults = []

  for (const entries of fontset.entries()) {
    await entries.forEach(async (entry) => {
      try {
        const {
          family,
          style,
          weight,
          stretch,
          status
        } = await entry.loaded

        fontResults.push({
          family,
          style,
          weight,
          stretch,
          status
        })
      } catch (error) {
        const {
          family,
          style,
          weight,
          stretch,
          status
        } = entry

        fontResults.push({
          family,
          style,
          weight,
          stretch,
          status
        })
      }
    })
  }

  perfTelemetry.async.push({
    'name': 'fontStats',
    'time': Date.now() - fontsStart
  })
  return fontResults
}

const init = async () => {
  const polyfillsResult = await polyfills()

  await vue()
  await Promise.all([
    loadedFonts(),
    removeLoadingIndicator()
  ])
  log.info(`Needed polyfills on this browser: ${JSON.stringify(polyfillsResult, null, 4)}`)

  return true
}

const main = async () => {
  await init()

  log.info(`Performance telemetry: ${JSON.stringify(perfTelemetry, null, 4)}`)
}

main()

perfTelemetry.blocking.push({
  'name': 'mainThread',
  'time': Date.now() - scriptsStart
})
