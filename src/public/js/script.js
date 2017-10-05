/* eslint no-console:0 */
import 'babel-polyfill'
import {runPolyfills} from './features'
import Vue from 'vue'
// import App from '../../../.tmp/app/app.vue'
import VueRouter from 'vue-router'
// import anime from 'animejs'

import appBase from '../../../.tmp/app-base/app-base.vue'
import indexRoute from '../../../.tmp/routes/index/index.vue'
import browseRoute from '../../../.tmp/routes/browse/browse.vue'
import loginRoute from '../../../.tmp/routes/login/login.vue'
import registerRoute from '../../../.tmp/routes/register/register.vue'

const polyfills = async () => {
  const ranPolyfills = await runPolyfills()

  window.polyfills = ranPolyfills
}

const removeLoadingIndicator = async () => {
  const loadingIndicator = document.querySelector('.loading-indicator')
  /* const node = await anime({
    'targets':  loadingIndicator,
    'bottom':   '100%',
    'duration': 700,
    'easing':   'easeInQuart'
  })

  await node.finished */

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

  const app = new Vue({
    router,
    'el':     'app',
    'render': (handle) => handle(appBase)
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
