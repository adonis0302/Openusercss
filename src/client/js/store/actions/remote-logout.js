import router from '../../router'
import {remoteLogout} from './helpers/remotes/mutations'

export default async ({commit, getters}) => {
  try {
    await remoteLogout(getters.session.token)
  } catch (error) {
    commit('actionError', error)
  }
  commit('logout')
  router.push('/login')
}
