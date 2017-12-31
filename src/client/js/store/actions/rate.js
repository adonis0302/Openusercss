import {cloneDeep, defaultsDeep} from 'lodash'
import {remoteRate} from './helpers/remotes/mutations'
import db from '../db'

export default async ({commit, getters}, {id, value}) => {
  commit('loading', true)

  try {
    const themes = db.getCollection('themes')
    const {data} = await remoteRate({id, value}, getters.session.token)
    const {rate} = cloneDeep(data)
    const {_id} = rate
    const theme = themes.findOne({
      _id
    })

    themes.update(defaultsDeep(rate, theme))
    commit('loading', false)
    commit('actionError', null)
  } catch (error) {
    commit('loading', false)
    commit('actionError', error)
  }
}
