import {remoteSendVerify} from './helpers/remotes/mutations'

export default async ({commit, getters}, token) => {
  commit('loading', true)
  let result = null

  try {
    result = await remoteSendVerify({token})
    commit('loading', false)
  } catch (error) {
    commit('loading', false)
    commit('actionError', error)
  }

  return result
}
