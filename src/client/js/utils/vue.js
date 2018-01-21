import Vue from 'vue'
import VueRouter from 'vue-router'
import VueFilters from 'vue2-filters'
import VueMoment from 'vue-moment'
import VeeValidate from 'vee-validate'
import VueMarkdown from 'vue-markdown'
import VueAsyncComputed from 'vue-async-computed'
import lodash, {cloneDeep,} from 'lodash'
import {mapGetters, mapActions,} from 'vuex'

import {ServerError,} from '../../../shared/custom-errors'
import appBase from '../../../components/pages/app-base.vue'
import router from './router'
import store from '../store'
import db, {upsert,} from '../store/db'
import {apolloClient,} from '../store/actions'

import {
  theme as themeQuery,
  user as userQuery,
} from '../store/actions/helpers/queries'

const renderOptions = (options) => {
  if (!options) {
    return []
  }

  return options.filter((option) => {
    let newValue = null

    try {
      newValue = JSON.parse(option.value)
    } catch (error) {
      newValue = option.value
    }

    option.value = newValue
    return option
  })
}

export const getUser = async (id) => {
  const users = db.getCollection('users')
  const existing = users.findOne({
    '_id': id.toString(),
  })

  if (!existing) {
    let userResult = null

    try {
      userResult = await apolloClient.query({
        'query': userQuery({
          'id': id.toString(),
        }),
      })
    } catch (error) {
      throw new ServerError({
        'message': error.message,
      })
    }

    const doneUser = cloneDeep(userResult.data.user)

    upsert('users', doneUser)
  }

  return users.findOne({
    '_id': id.toString(),
  }) || {}
}

export const getTheme = async (id) => {
  const themes = db.getCollection('themes')
  const existing = themes.findOne({
    '_id': id.toString(),
  })

  if (!existing) {
    let themeResult = null

    try {
      themeResult = await apolloClient.query({
        'query': themeQuery({
          'id': id.toString(),
        }),
      })
    } catch (error) {
      throw new ServerError({
        'message': error.message,
      })
    }

    const doneTheme = cloneDeep(themeResult.data.theme)

    doneTheme.options = renderOptions(doneTheme.options)
    upsert('themes', doneTheme)
  }

  getUser(themes.findOne({
    '_id': id.toString(),
  }).user)

  return themes.findOne({
    '_id': id.toString(),
  }) || {}
}

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
Vue.use(VueAsyncComputed)
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

    '_':         () => lodash,
    'extension': () => process.extension,
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

    getTheme,
    getUser,

    getIterable (collectionName, input) {
      console.warn('getIterable is deprecated, use getTheme or getUser')
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

      return db.getCollection(collectionName).chain().find(query)
    },
  },
})

export {
  Vue,
  store,
  router,
  appBase,
}
