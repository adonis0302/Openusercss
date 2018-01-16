import {getUser,} from '../translators/get-user'

export default async ({commit, getters,}, id) => {
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
