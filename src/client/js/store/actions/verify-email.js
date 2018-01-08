// import router from '../../router'
import {verifyEmail,} from './helpers/remotes/mutations'

export default async ({getters, commit,}, token) => {
  commit('loading', true)
  let result = null

  try {
    result = await verifyEmail(token)
    commit('loading', false)
  } catch (error) {
    commit('loading', false)
    commit('actionError', error)
  }

  return result
}
