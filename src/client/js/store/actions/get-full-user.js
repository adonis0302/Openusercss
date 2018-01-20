import {getUser,} from '../translators/get-user'

export default async ({commit, getters,}, id) => {
  console.warn([
    'The getFullUser action is depracated, use the one',
    'attached to the Vue instance!',
  ].join('\n'))
  commit('loading', true)

  try {
    const user = await getUser({
      id,
    })

    commit('loading', false)
    commit('actionError', null)
    return user
  } catch (error) {
    commit('loading', false)
    commit('actionError', error)
  }
}
