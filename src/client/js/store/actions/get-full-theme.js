import {pick, cloneDeep} from 'lodash'
import {getFullTheme} from './helpers/remotes/queries'

export default async ({commit, getters}, id) => {
  commit('loading', true)

  try {
    const {data} = await getFullTheme(id)
    const {theme} = cloneDeep(data)
    const user = pick(theme.user, [
      '_id'
    ])

    Reflect.deleteProperty(theme, 'user')
    theme.user = user
    commit('themes', [
      theme
    ])
    commit('users', [
      theme.user
    ])
    commit('actionError', null)
  } catch (error) {
    commit('deleteTheme', id)
    commit('actionError', error)
  }

  commit('loading', false)
}
