import {pick} from 'lodash'
import {getFullTheme} from './helpers/remotes/queries'

export default async ({commit, getters}, id) => {
  commit('loading', true)

  try {
    const {data} = await getFullTheme(id)
    const {theme} = data
    const user = pick(theme.user, [
      '_id'
    ])
    const preparedTheme = pick(theme, [
      '__typename',
      '_id',
      'content',
      'createdAt',
      'description',
      'lastUpdate',
      'rating',
      'scope',
      'title',
      'version'
    ])

    preparedTheme.user = user
    commit('themes', [
      preparedTheme
    ])
    commit('actionError', null)
  } catch (error) {
    commit('deleteTheme', id)
    commit('actionError', error)
  }

  commit('loading', false)
}
