/* eslint no-console:0 */
import 'babel-polyfill'
import {runPolyfills} from './features'
import Vue from 'vue'
import App from '../../../.tmp/app/app.vue'

const polyfills = async () => {
  const ranPolyfills = await runPolyfills()

  window.polyfills = ranPolyfills
}

const vue = async () => {
  const app = new Vue({
    'el':         'app',
    'render':     (h) => h(App),
    'components': {App}
  })

  document.querySelector('noscript').remove()

  return app
}

polyfills()
vue()
