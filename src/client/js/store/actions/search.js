import {cloneDeep} from 'lodash'
import {search as remoteSearch} from './helpers/remotes/queries'
import db, {upsert} from '../db'

export default async ({commit, getters}, {terms, limit, skip}) => {
  commit('loading', true)

  try {
    const themes = db.getCollection('themes')
    const users = db.getCollection('users')
    const {data} = await remoteSearch({terms, limit, skip})
    const {search} = data

    search.themes.forEach((theme) => {
      const savedTheme = cloneDeep(theme)

      savedTheme.user = {
        '_id': theme.user._id
      }
      upsert(themes, savedTheme)
    })
    search.users.forEach((user) => {
      const savedUser = cloneDeep(user)
      const userThemes = []

      user.themes.forEach((theme) => {
        userThemes.push({
          '_id': theme._id
        })
      })
      savedUser.themes = userThemes
      upsert(users, savedUser)
    })
    commit('loading', false)
    commit('actionError', null)
    return search
  } catch (error) {
    commit('loading', false)
    commit('actionError', error)
  }
}
