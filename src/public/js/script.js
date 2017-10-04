/* eslint no-console:0 */
import 'babel-polyfill'
import {runPolyfills} from './features'
import Vue from 'vue'
import App from '../../../.tmp/app/app.vue'
// import fontawesome from '@fortawesome/fontawesome'

/* const runFA = async () => {
  try {
    fontawesome.config = {
      'familyPrefix': 'fa'
    }
    fontawesome.dom.i2svg()
  } catch (error) {
    console.error('Error while applying FontAwesome')
    console.error(error)
  }

  return true
} */

const polyfills = async () => {
  const ranPolyfills = await runPolyfills()

  window.polyfills = ranPolyfills
}

const vue = async () => {
  window.app = new Vue({
    'el':         'app',
    'render':     (h) => h(App),
    'components': {App}
  })

  document.querySelector('noscript').remove()
}

// runFA()
polyfills()
vue()
