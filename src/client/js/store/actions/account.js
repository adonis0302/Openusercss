import {cloneDeep} from 'lodash'
import router from '../../router'
import {remoteAccount} from './helpers/remotes/mutations'
import db from '../db'

export default async ({commit, getters}, {accountData, redirect}) => {
  commit('loading', true)

  try {
    const users = db.getCollection('users')
    const {data} = await remoteAccount(accountData, getters.session.token)
    const {account} = cloneDeep(data)
    const {_id} = account
    const user = users.findOne({
      _id
    })

    user.bio = account.bio

    users.update(user)
    commit('actionError', null)
    commit('loading', false)
    router.push(redirect)
  } catch (error) {
    commit('loading', false)
    commit('actionError', error)
  }
}
