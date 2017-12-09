import {defaultsDeep} from 'lodash'
import router from '../../router'
import {remoteSaveTheme} from './helpers/remotes/mutations'

export default async ({commit, getters}, {readyTheme, redirect}) => {
  commit('loading', true)

  readyTheme.content = readyTheme.content.replace(/[\n]/g, '\\n')
  readyTheme.content = readyTheme.content.replace(/[']/g, '\'')
  readyTheme.content = readyTheme.content.replace(/["]/g, '\\"')
  readyTheme.scope = readyTheme.scope.replace(/\\/g, '\\\\')

  try {
    const {data} = await remoteSaveTheme(readyTheme, getters.session.token)
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
      defaultsDeep(theme, readyTheme)
    ])
    commit('actionError', null)
    router.push(redirect)
  } catch (error) {
    commit('actionError', error)
  }

  commit('loading', false)
}
