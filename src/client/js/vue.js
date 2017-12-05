import Vue from 'vue'
import VeeValidate from 'vee-validate'
import VueRouter from 'vue-router'
import VueFilters from 'vue2-filters'
import VueMoment from 'vue-moment'
import VModal from 'vue-js-modal'

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
Vue.use(VueFilters)
Vue.use(VueMoment)
Vue.use(VModal)

export {router}

export const app = new Vue({
  store,
  router,
  ...appBase
})
