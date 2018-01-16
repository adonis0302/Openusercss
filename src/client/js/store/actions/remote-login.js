import {cloneDeep,} from 'lodash'
import router from '../../utils/router'
import {remoteLogin,} from './helpers/remotes/mutations'
import {upsert,} from '../db'

export default async ({commit,}, authData) => {
  commit('loading', true)

  try {
    const {data,} = await remoteLogin(authData)
    const {login,} = data
    const {user,} = cloneDeep(login)

    upsert('users', user)

    commit('login', {
      'token': login.token,
      'ip':    login.ip,
      'ua':    login.ua,
      'user':  {
        '_id': login.user._id,
      },
    })
    commit('loading', false)
    commit('actionError', null)
    router.push('/')
  } catch (error) {
    commit('loading', false)
    commit('actionError', error)
  }
}
