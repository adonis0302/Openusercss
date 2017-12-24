import {cloneDeep} from 'lodash'
import router from '../../router'
import {remoteLogin} from './helpers/remotes/mutations'
import db, {upsert} from '../db'

export default async ({commit}, authData) => {
  commit('loading', true)

  try {
    const themes = db.getCollection('themes')
    const users = db.getCollection('users')
    const {data} = await remoteLogin(authData)
    const {login} = data

    commit('login', {
      'token': login.token,
      'ip':    login.ip,
      'ua':    login.ua,
      'user':  {
        '_id': login.user._id
      }
    })

    const {user} = cloneDeep(login)

    if (user.themes.length) {
      user.themes.forEach((theme) => {
        upsert(themes, {
          ...theme,
          'user': {
            '_id': user._id
          }
        })
      })
    }

    const userThemeRefs = []

    if (user.themes.length) {
      user.themes.forEach((theme) => {
        userThemeRefs.push({
          '_id': theme._id
        })
      })
    }

    upsert(users, {
      ...user,
      'themes': userThemeRefs
    })

    commit('loading', false)
    commit('actionError', null)
    router.push('/')
  } catch (error) {
    commit('loading', false)
    commit('actionError', error)
  }
}
