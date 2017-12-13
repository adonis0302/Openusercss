import {cloneDeep} from 'lodash'
import router from '../../router'
import {remoteSaveTheme} from './helpers/remotes/mutations'

export default async ({commit, getters}, {readyTheme, redirect}) => {
  commit('loading', true)

  try {
    const {data} = await remoteSaveTheme(readyTheme, getters.session.token)
    const {theme} = cloneDeep(data)

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

    theme.user = {
      '_id': theme.user._id
    }
    commit('themes', [
      theme
    ])
    commit('actionError', null)
    router.push(redirect)
  } catch (error) {
    commit('actionError', error)
  }

  commit('loading', false)
}
