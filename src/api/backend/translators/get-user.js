import User from '../../connector/schema/user'
import Theme from '../../connector/schema/theme'
import {getTheme,} from './get-theme'

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
