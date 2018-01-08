import User from '../../connector/schema/user'
import Theme from '../../connector/schema/theme'
import {getRatings,} from './get-rating'

export const getUser = async (query) => {
  const user = await User.findOne(query, {
    'populate': true,
  })

  if (user) {
    user.themes = await Theme.find({
      'user': user._id,
    }, {
      'populate': true,
    })

    user.themes = await Promise.all(user.themes.map(async (theme) => {
      theme.ratings = await getRatings({
        'theme': theme._id,
      })

      return theme
    }))
  }

  return user
}
