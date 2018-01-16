import {cloneDeep,} from 'lodash'
import {search as remoteSearch,} from './helpers/remotes/queries'
import db, {upsert,} from '../db'

export default async ({commit, getters,}, {terms, limit, skip,}) => {
  commit('loading', true)

  try {
    const themes = db.getCollection('themes')
    const users = db.getCollection('users')
    const {data,} = await remoteSearch({terms, limit, skip,})
    const {search,} = data

    search.themes.forEach((theme) => {
      const savedTheme = cloneDeep(theme)

      savedTheme.options = savedTheme.options.filter((option) => {
        let newValue = null

        try {
          newValue = JSON.parse(option.value)
        } catch (error) {
          newValue = option.value
        }

        option.value = newValue
        return option
      })

      upsert(themes, savedTheme)
    })
    search.users.forEach((user) => {
      upsert(users, user)
    })
    commit('loading', false)
    commit('actionError', null)
    return search
  } catch (error) {
    commit('loading', false)
    commit('actionError', error)
  }
}
