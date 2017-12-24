import router from '../../router'
import {deleteTheme as deleteThemeRemote} from './helpers/remotes/mutations'
import db from '../db'

export default async ({commit, getters}, {id, redirect}) => {
  commit('loading', true)
  const themes = db.getCollection('themes')

  try {
    await deleteThemeRemote(id, getters.session.token)
    themes.findAndRemove({
      '_id': id
    })
    commit('loading', false)
    commit('actionError', null)
    router.push(redirect)
  } catch (error) {
    commit('loading', false)
    commit('actionError', error)
  }
}
