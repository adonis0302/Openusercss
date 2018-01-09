import {cloneDeep, uniqBy,} from 'lodash'
import router from '../../utils/router'
import {remoteSaveTheme,} from './helpers/remotes/mutations'
import db, {upsert,} from '../db'
import {struct,} from 'superstruct'

const validators = {}

validators.option = struct({
  'type':  'string',
  'label': 'string',
  'name':  'string',
  'value': 'any',
})

export default async ({commit, getters,}, {readyTheme, redirect,}) => {
  commit('loading', true)

  try {
    if (!getters.session) {
      throw new Error('You must be logged in to do this')
    }

    readyTheme.options.forEach((option) => {
      validators.option(option)
    })

    const themes = db.getCollection('themes')
    const users = db.getCollection('users')
    const {data,} = await remoteSaveTheme(readyTheme, getters.session.token)
    const {theme,} = cloneDeep(data)
    const user = users.findOne({
      '_id': theme.user._id,
    })

    user.themes = uniqBy([
      ...user.themes || [],
      theme,
    ], '_id')
    users.update(user)

    theme.user = {
      '_id': theme.user._id,
    }

    theme.options = theme.options.filter((option) => {
      let newValue = null

      try {
        newValue = JSON.parse(option.value)
      } catch (error) {
        newValue = option.value
      }

      if (newValue instanceof Array) {
        option.value = newValue.filter((value) => {
          Reflect.deleteProperty(value, '__typename')

          return value
        })
      }

      return option
    })

    theme.options = theme.options.filter((option) => {
      let newValue = null

      try {
        newValue = JSON.parse(option.value)
      } catch (error) {
        newValue = option.value
      }

      option.value = newValue
      return option
    })

    upsert(themes, theme)
    commit('actionError', null)
    commit('loading', false)
    router.push(redirect)
  } catch (error) {
    commit('loading', false)
    commit('actionError', error)
  }
}
