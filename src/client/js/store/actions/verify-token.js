import {verifyToken as verifyTokenRemote} from './helpers/remotes/queries'

export default async ({commit, getters}) => {
  commit('loading', true)

  try {
    const session = getters.session

    if (!session) {
      commit('loading', false)
      return false
    }

    const {data} = await verifyTokenRemote(session.token)
    const {verifyToken} = data

    if (!verifyToken) {
      commit('logout')
    } else {
      commit('login', {
        'token': verifyToken.token,
        'ip':    verifyToken.ip,
        'ua':    verifyToken.ua,
        'user':  {
          '_id': verifyToken.user._id
        }
      })
      commit('users', [
        verifyToken.user
      ])
    }
  } catch (error) {
    commit('actionError', error)
  }

  commit('loading', false)
}
