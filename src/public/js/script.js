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

const polyfills = async () => {
  const ranPolyfills = await runPolyfills()

  window.polyfills = ranPolyfills
}

const removeLoadingIndicator = async () => {
  const loadingIndicator = document.querySelector('.loading-indicator')
  const node = await anime({
    'targets':  loadingIndicator,
    'bottom':   '100%',
    'duration': 700,
    'easing':   'easeInQuart'
  })

  await node.finished

  loadingIndicator.remove()
  return true
}

const vue = async () => {
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
  removeLoadingIndicator()

  const executionLength = Date.now() - scriptsStart

  log.info(`Clientside Javascript execution took ${executionLength}ms`)
  return app
}

(async () => {
  await polyfills()
  await vue()
})()
