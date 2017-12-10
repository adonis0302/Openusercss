import {cloneDeep} from 'lodash'
import {getLatestThemes} from './helpers/remotes/queries'

export default async ({commit, getters}, id) => {
  commit('loading', true)

  try {
    const result = await getLatestThemes(id)

    result.data.latestThemes.forEach((theme) => {
      const savedTheme = cloneDeep(theme)

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
