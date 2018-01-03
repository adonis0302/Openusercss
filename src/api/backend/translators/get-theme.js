import Theme from '../../connector/schema/theme'
import {getRatings} from './get-rating'

export default async (query) => {
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
