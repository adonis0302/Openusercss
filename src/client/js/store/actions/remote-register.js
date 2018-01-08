import router from '../../router'
import {remoteRegister,} from './helpers/remotes/mutations'

export default async ({getters, commit,}, registerData) => {
  commit('loading', true)

  try {
    await remoteRegister(registerData)
    commit('loading', false)
    router.push('/login')
  } catch (error) {
    commit('loading', false)
    commit('actionError', error)
  }
}
