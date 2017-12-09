import router from '../../router'
import {remoteRegister} from './helpers/remotes/mutations'

export default async ({getters, commit}, registerData) => {
  commit('loading', true)

  try {
    await remoteRegister(registerData)
    router.push('/login')
  } catch (error) {
    commit('actionError', error)
  }

  commit('loading', false)
}
