import {apolloClient} from '.'
import {verifyToken as query} from './queries'

const verify = async (token) => {
  let result = null

  try {
    result = await apolloClient.query({
      'query': query({token})
    })
  } catch (error) {
    result = false
  }

  return result
}

export default async ({commit, getters}) => {
  commit('loading', true)

  try {
    const session = getters.session

    if (!session) {
      commit('loading', false)
      return false
    }

    const {data} = await verify(session.token)
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
