import Vue from 'vue'
import VueRouter from 'vue-router'
import VueFilters from 'vue2-filters'
import VueMoment from 'vue-moment'
import VeeValidate from 'vee-validate'
import VueMarkdown from 'vue-markdown'

import router from './router'
import store from '../store'
import appBase from '../../../components/pages/app-base.vue'

const mixins = []

Vue.use(VeeValidate, {
  'errorBagName':  'errors',
  'fieldsBagName': 'vee-fields',
  'delay':         0,
  'locale':        'en',
  'dictionary':    null,
  'classes':       true,
  'strict':        true,
  'events':        'input|blur',
  'inject':        true,
  'validity':      false,
  'aria':          true,
})
Vue.use(VueRouter)
Vue.use(VueFilters)
Vue.use(VueMoment)
Vue.component('vue-markdown', VueMarkdown)

Vue.prototype.$anchorAttributes = {
  'target': '_blank',
  'rel':    'nofollow noopener',
}

export {
  Vue,
  store,
  router,
  appBase,
  mixins,
}
