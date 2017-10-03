/* eslint no-console:0 */
import 'babel-polyfill'
import {runPolyfills} from './features'
import Vue from 'vue'
import App from '../../../.tmp/app/app.vue'

import './brands.min'
import './regular.min'
import './fontawesome.min'

// =============================================================================
// FEATURES AND INIT
// =============================================================================

runPolyfills()
.then((ranPolyfills) => {
  window.polyfills = ranPolyfills
})

// =============================================================================
// Vue
// =============================================================================

window.app = new Vue({
  'el':         'app',
  'render':     (h) => h(App),
  'components': {App}
})

// document.querySelector('.no-js-message').remove()
