import Vue from 'vue'
import VueRouter from 'vue-router'
import VueFilters from 'vue2-filters'
import VueMoment from 'vue-moment'
import VeeValidate from 'vee-validate'
import VueMarkdown from 'vue-markdown'
import lodash from 'lodash'
import {mapGetters, mapActions,} from 'vuex'

import router from './router'
import store from '../store'
import appBase from '../../../components/pages/app-base.vue'

import db from '../store/db'

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

Vue.mixin({
  'computed': {
    ...mapGetters([
      'actionErrors',
      'session',
      'loading',
      'currentUser',
    ]),

    '$anchorAttributes': () => ({
      'target': '_blank',
      'rel':    'nofollow noopener',
    }),

    '_': () => lodash,
  },
  'methods': {
    ...mapActions([
      'logout',
      'login',
      'register',
      'verifyToken',
      'saveTheme',
      'deleteTheme',
      'getFullUser',
      'getFullTheme',
      'getLatestThemes',
      'search',
      'verifyEmail',
      'sendVerify',
      'account',
      'rate',
      'getPopularThemes',
    ]),

    getIterable (collectionName, input) {
      if (typeof collectionName !== 'string') {
        throw new Error(`collectionName must be a string, got ${JSON.stringify(collectionName)}`)
      }

      let query = null

      if (typeof input === 'string') {
        query = {
          '_id': input,
        }
      } else {
        query = input
      }

      return db.getCollection(collectionName).find(query)
    },
  },
})

export {
  Vue,
  store,
  router,
  appBase,
}
