import {getTheme,} from '../translators/get-theme'

export default async ({commit, getters,}, id) => {
  // eslint-disable-next-line no-console
  console.warn([
    'The getFullTheme action is depracated, use the one',
    'attached to the Vue instance!',
  ].join('\n'))
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
