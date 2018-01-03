import Theme from '../../connector/schema/theme'
import {getRatings} from './get-rating'

export const getTheme = async (query) => {
  const theme = await Theme.findOne(query, {
    'populate': true
  })

  if (theme) {
    theme.ratings = await getRatings({
      'theme': theme._id
    })
  }

  return theme
}
