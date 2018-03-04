import Vue from 'vue'
import VueRouter from 'vue-router'
import {cloneDeep,} from 'lodash'
import {mapGetters, mapActions,} from 'vuex'

import {getThemes,} from '../store/translators/get-theme'
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
        'query':     userQuery,
        'variables': {
          id,
        },
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
        'query':     themeQuery,
        'variables': {
          id,
        },
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

  return themes.findOne({
    '_id': id.toString(),
  }) || {}
}

Vue.use(VueRouter)

Vue.mixin({
  'computed': {
    ...mapGetters([
      'actionErrors',
      'session',
      'loading',
      'currentUser',
    ]),
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
    getThemes,
    getUser,
  },
})

export {
  Vue,
  store,
  router,
  appBase,
}
