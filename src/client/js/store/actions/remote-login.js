import {cloneDeep} from 'lodash'
import router from '../../router'
import {remoteLogin} from './helpers/remotes/mutations'

export default async ({commit}, authData) => {
  commit('loading', true)

  try {
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
    const userThemes = []

    if (user.themes.length) {
      user.themes.forEach((theme) => {
        userThemes.push({
          ...theme,
          'user': {
            '_id': user._id
          }
        })
      })

      commit('themes', userThemes)
    }

    const userThemeRefs = []

    if (user.themes.length) {
      user.themes.forEach((theme) => {
        userThemeRefs.push({
          '_id': theme._id
        })
      })
    }

    commit('users', [
      {
        ...user,
        'themes': userThemeRefs
      }
    ])

    commit('actionError', null)
    router.push('/')
  } catch (error) {
    commit('actionError', error)
  }

  commit('loading', false)
}
