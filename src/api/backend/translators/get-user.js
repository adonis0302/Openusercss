import User from '../../connector/schema/user'
import Theme from '../../connector/schema/theme'
import {getTheme,} from './get-theme'
import raven from 'raven'

export const getUser = async (query) => {
  const user = await User.findOne(query, {
    'populate': true,
  })

  if (user) {
    user.themes = await Theme.find({
      'user': user._id,
    }, {
      'populate': false,
    })

    user.themes = await Promise.all(user.themes.map(async (theme) => {
      return getTheme({
        '_id': theme._id,
      })
    }))
  }

  return user
}

export const getUsers = async (query, options) => {
  let users = null

  options.populate = false
  try {
    users = await User.find(query, options)
    users = Promise.all(users.filter(async (user) => {
      if (user) {
        user.themes = await Theme.find({
          'user': user._id,
        }, {
          'populate': false,
        })

        user.themes = await Promise.all(user.themes.map(async (theme) => {
          return getTheme({
            '_id': theme._id,
          })
        }))
      }
    }))
  } catch (error) {
    raven.captureException(error)
  }

  return users
}
