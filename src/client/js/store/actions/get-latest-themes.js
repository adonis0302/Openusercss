import {cloneDeep,} from 'lodash'
import {getLatestThemes,} from './helpers/remotes/queries'
import {upsert,} from '../db'
import {renderOptions,} from '../translators/get-theme'

export default async ({commit, getters,}, id) => {
  commit('loading', true)

  try {
    const {data,} = await getLatestThemes(id)
    const {latestThemes,} = data

    latestThemes.forEach((theme) => {
      const savedTheme = cloneDeep(theme)

      savedTheme.options = renderOptions(savedTheme.options)

      upsert('themes', savedTheme)
    })
    commit('loading', false)
    commit('actionError', null)
    return latestThemes
  } catch (error) {
    commit('loading', false)
    commit('actionError', error)
  }
}
