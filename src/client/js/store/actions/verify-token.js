import {verifyToken as verifyTokenRemote} from './helpers/remotes/queries'
import db, {upsert} from '../db'
import {cloneDeep} from 'lodash'

export default async ({commit, getters}) => {
  commit('loading', true)

  try {
    const session = getters.session

    if (!session) {
      commit('loading', false)
      return false
    }

    const users = db.getCollection('users')
    const {data} = await verifyTokenRemote(session.token)
    const {verifyToken} = cloneDeep(data)

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
      upsert(users, verifyToken.user)
    }
    return true
  } catch (error) {
    commit('actionError', error)
  }

  commit('loading', false)
  return false
}
