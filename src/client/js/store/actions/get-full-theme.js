import {cloneDeep} from 'lodash'
import {getFullTheme} from './helpers/remotes/queries'
import db, {upsert} from '../db'

export default async ({commit, getters}, id) => {
  commit('loading', true)
  const themes = db.getCollection('themes')
  const users = db.getCollection('users')

  try {
    const {data} = await getFullTheme(id)
    const {theme} = cloneDeep(data)

    upsert(users, theme.user)
    theme.user = {
      '_id': theme.user._id
    }

    upsert(themes, theme)
    commit('actionError', null)
    commit('loading', false)
    return theme
  } catch (error) {
    themes.findAndRemove({
      '_id': id
    })
    commit('actionError', error)
    commit('loading', false)
    throw error
  }
}
