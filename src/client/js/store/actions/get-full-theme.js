import {getTheme,} from '../translators/get-theme'

export default async ({commit, getters,}, id) => {
  commit('loading', true)

  try {
    const theme = await getTheme({
      id,
    })

    commit('actionError', null)
    commit('loading', false)
    return theme
  } catch (error) {
    commit('actionError', error)
    commit('loading', false)
  }
}
