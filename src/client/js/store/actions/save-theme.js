import {cloneDeep, uniqBy} from 'lodash'
import router from '../../router'
import {remoteSaveTheme} from './helpers/remotes/mutations'
import db, {upsert} from '../db'

export default async ({commit, getters}, {readyTheme, redirect}) => {
  commit('loading', true)

  try {
    const themes = db.getCollection('themes')
    const users = db.getCollection('users')
    const {data} = await remoteSaveTheme(readyTheme, getters.session.token)
    const {theme} = cloneDeep(data)
    const user = users.findOne({
      '_id': theme.user._id
    })

    users.findAndRemove({
      '_id': theme.user._id
    })
    user.themes = uniqBy([
      ...user.themes,
      theme
    ], '_id')
    users.insert(user)

    theme.user = {
      '_id': theme.user._id
    }
    upsert(themes, theme)
    commit('actionError', null)
    router.push(redirect)
  } catch (error) {
    commit('actionError', error)
  }

  commit('loading', false)
}
