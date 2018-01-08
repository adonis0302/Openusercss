import router from '../../utils/router'
import {remoteLogout,} from './helpers/remotes/mutations'

export default async ({commit, getters,}) => {
  commit('loading', true)

  try {
    await remoteLogout(getters.session.token)
    commit('loading', false)
  } catch (error) {
    commit('loading', false)
    commit('actionError', error)
  }
  commit('logout')
  router.push('/login')
}
