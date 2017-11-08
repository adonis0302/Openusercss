import Vue from 'vue'
import VeeValidate from 'vee-validate'
import VueRouter from 'vue-router'

import router from './router'
import store from './store'

import appBase from '../../../.tmp/pages/app-base/app-base.vue'

Vue.use(VueRouter)
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
})
