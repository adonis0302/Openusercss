/* eslint no-console:0 */
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import VueRouter from 'vue-router'
import log from 'chalk-console'
import {uniq} from 'lodash'

import {router} from './vue-modules'
import {store} from './store'
import {runPolyfills} from './utils/features'
import appBase from '../../../.tmp/app-base/app-base.vue'

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

const vue = async () => {
  const vueStart = Date.now()

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

  const app = new Vue({
    store,
    router,
    'el':     'app',
    'render': (handle) => handle(appBase)
  })

  document.querySelector('noscript').remove()

  perfStats.sync.push({
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
    try {
      const {
        family,
        style,
        weight,
        stretch,
        status
      } = await entries[0]

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
      } = entries[0]

      fontResults.push({
        family,
        style,
        weight,
        stretch,
        status
      })
    }
  }

  perfStats.async.push({
    'name': 'fontStats',
    'time': Date.now() - fontsStart
  })
  return uniq(fontResults)
}

const init = async () => {
  const polyfillsResult = await polyfills()

  vue()
  const fontResults = await loadedFonts()

  // log.info(`Font statistics: ${JSON.stringify(fontResults, null, 4)}`)
  log.info(`Needed polyfills on this browser: ${JSON.stringify(polyfillsResult, null, 4)}`)

  return true
}

const main = async () => {
  await init()
  // log.info(`Performance statistics: ${JSON.stringify(perfStats, null, 4)}`)
}

main()

perfStats.blocking.push({
  'name': 'mainThread',
  'time': Date.now() - scriptsStart
})
