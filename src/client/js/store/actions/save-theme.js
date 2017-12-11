import {defaultsDeep, cloneDeep} from 'lodash'
import router from '../../router'
import {remoteSaveTheme} from './helpers/remotes/mutations'

export default async ({commit, getters}, {readyTheme, redirect}) => {
  commit('loading', true)

  const preparedTheme = cloneDeep(readyTheme)

  try {
    const {data} = await remoteSaveTheme(preparedTheme, getters.session.token)
    const {theme} = data

    commit('users', [
      {
        '_id':    theme.user._id,
        'themes': [
          {
            '_id': theme._id
          }
        ]
      }
    ])
    Reflect.deleteProperty(theme.user, 'themes')
    commit('themes', [
      defaultsDeep(theme, preparedTheme)
    ])
    commit('actionError', null)
    router.push(redirect)
  } catch (error) {
    commit('actionError', error)
  }

  commit('loading', false)
}
