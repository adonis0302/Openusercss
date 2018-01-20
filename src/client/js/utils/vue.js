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

export const getUser = async (query) => {
  const users = db.getCollection('users')

  if (query._id === 'undefined') {
    return {}
  }
  let doneQuery = query

  if (typeof query === 'string') {
    doneQuery = {
      '_id': query,
    }
  }
  const existing = users.findOne(doneQuery)

  if (!existing) {
    let userResult = null

    try {
      userResult = await apolloClient.query({
        'query': userQuery(query),
      })
    } catch (error) {
      throw new ServerError({
        'message': error.message,
      })
    }

    const doneUser = cloneDeep(userResult.data.user)

    upsert('users', doneUser)
  }

  return users.findOne(query) || {}
}

export const getTheme = async (query) => {
  const themes = db.getCollection('themes')

  if (query._id === 'undefined') {
    return {}
  }
  let doneQuery = query

  if (typeof query === 'string') {
    doneQuery = {
      '_id': query,
    }
  }
  const existing = themes.findOne(doneQuery)

  if (!existing) {
    let themeResult = null

    try {
      themeResult = await apolloClient.query({
        'query': themeQuery(query),
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

  getUser({
    'id': themes.findOne(query).user,
  })

  return themes.findOne(query) || {}
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

      return db.getCollection(collectionName).chain().find(query)
    },

    getTheme,
    getUser,
  },
})

export {
  Vue,
  store,
  router,
  appBase,
}
