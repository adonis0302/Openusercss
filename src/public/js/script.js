/* eslint no-console:0 */
import 'babel-polyfill'
import {runPolyfills} from './features'
import Vue from 'vue'
import App from '../../../.tmp/app/app.vue'
import anime from 'animejs'

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
  const app = new Vue({
    'el':         'app',
    'render':     (h) => h(App),
    'components': {App}
  })

  document.querySelector('noscript').remove()
  removeLoadingIndicator()

  return app
}

(async () => {
  await polyfills()
  await vue()
})()
