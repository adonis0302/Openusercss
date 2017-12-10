import {pick} from 'lodash'
import {getLatestThemes} from './helpers/remotes/queries'

export default async ({commit, getters}, id) => {
  commit('loading', true)

  try {
    const result = await getLatestThemes(id)

    result.data.latestThemes.forEach((theme) => {
      const savedTheme = pick(theme, [
        '_id',
        'title',
        'description',
        'lastUpdate',
        'createdAt'
      ])

      savedTheme.user = {
        '_id': theme.user._id
      }
      commit('themes', [
        savedTheme
      ])
      commit('users', [
        theme.user
      ])
    })
    commit('actionError', null)
  } catch (error) {
    commit('actionError', error)
  }

  commit('loading', false)
}
