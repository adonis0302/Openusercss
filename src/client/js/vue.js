import Vue from 'vue'
import VueRouter from 'vue-router'
import VueFilters from 'vue2-filters'
import VueMoment from 'vue-moment'

import router from './router'
import store from './store'

import appBase from '../../../.tmp/pages/app-base/app-base.vue'

Vue.use(VueRouter)
Vue.use(VueFilters)
Vue.use(VueMoment)

export {
  Vue,
  store,
  router,
  appBase
}
