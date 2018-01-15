import User from '../../connector/schema/user'
import Theme from '../../connector/schema/theme'
import raven from 'raven'

export const getUser = async (query) => {
  return User.findOne(query, {
    'populate': true,
  })
}

export const getUsers = async (query, options = {}) => {
  options.populate = false
  try {
    const foundUsers = await User.find(query, options)
    const result = await Promise.all(foundUsers.filter(async (user) => {
      user.themes = []

      const themes = await Theme.find({
        'user': user._id,
      }, {
        'populate': false,
      })

      themes.forEach((theme) => {
        user.themes.push(theme._id)
      })
      return user
    }))

    return result
  } catch (error) {
    raven.captureException(error)
  }

  return []
}
