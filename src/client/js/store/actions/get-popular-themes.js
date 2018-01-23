import {cloneDeep,} from 'lodash'
import {getPopularThemes,} from './helpers/remotes/queries'
import {upsert,} from '../db'

export default async ({commit, getters,}, limit) => {
  commit('loading', true)

  try {
    const {data,} = await getPopularThemes(limit)
    const {popularThemes,} = data
    const savedThemes = []

    popularThemes.forEach((theme) => {
      const savedTheme = cloneDeep(theme)

      savedTheme.options = savedTheme.options.filter((option) => {
        let newValue = null

        try {
          newValue = JSON.parse(option.value)
        } catch (error) {
          newValue = option.value
        }

        option.value = newValue
        return option
      })

      savedThemes.push(savedTheme)
      upsert('themes', savedTheme)
    })
    commit('loading', false)
    commit('actionError', null)
    return savedThemes
  } catch (error) {
    commit('loading', false)
    commit('actionError', error)
  }
}
