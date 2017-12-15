// import router from '../../router'
import {verifyEmail} from './helpers/remotes/queries'

export default async ({getters, commit}, token) => {
  commit('loading', true)
  let result = null

  try {
    result = await verifyEmail(token)
  } catch (error) {
    commit('actionError', error)
  }

  commit('loading', false)
  return result
}
