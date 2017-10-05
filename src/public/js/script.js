/* eslint no-console:0 */
import 'babel-polyfill'
import {runPolyfills} from './features'
import Vue from 'vue'
// import App from '../../../.tmp/app/app.vue'
import VueRouter from 'vue-router'
import anime from 'animejs'

import indexRoute from '../../../.tmp/routes/index/index.vue'

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
    'delay':    1300,
    'easing':   'easeInQuart'
  })

  await node.finished

  loadingIndicator.remove()
  return true
}

const vue = async () => {
  Vue.use(VueRouter)

  const router = new VueRouter({
    'mode':   'history',
    'routes': [
      {
        'path':      '/',
        'component': indexRoute
      }
    ]
  })

  const app = new Vue({
    router,
    'el':     'app',
    'render': (handle) => handle(indexRoute)
    // 'components': {App}
  })

  document.querySelector('noscript').remove()
  removeLoadingIndicator()

  return app
}

(async () => {
  await polyfills()
  await vue()
})()
