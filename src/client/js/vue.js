import Vue from 'vue'
import VeeValidate from 'vee-validate'
import VueRouter from 'vue-router'
// import VueTooltip from 'v-tooltip'

import router from './router'
import store from './store'

import appBase from '../../../.tmp/pages/app-base/app-base.vue'
// import {popperCreate} from '../../shared/animations'

Vue.use(VueRouter)
/* Vue.use(VueTooltip, {
  'disposeTimeout':       0,
  'defaultPlacement':     'bottom-center',
  'defaultOffset':        '10px',
  'defaultPopperOptions': {
    'onUpdate': popperCreate
  }
}) */
Vue.use(VeeValidate, {
  'errorBagName':  'errors',
  'fieldsBagName': 'fields',
  'delay':         0,
  'locale':        'en',
  'dictionary':    null,
  'strict':        true,
  'classes':       true,
  'events':        'input|blur',
  'inject':        true,
  'validity':      false,
  'aria':          true
})

export {router}

export const app = new Vue({
  store,
  router,
  ...appBase
  // 'render': (handle) => handle(appBase)
})
