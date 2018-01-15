import raven from 'raven'

import Rating from '../../connector/schema/rating'
import Theme from '../../connector/schema/theme'
import User from '../../connector/schema/user'
import {getTheme,} from './get-theme'

export const getRating = async (query, options = {}) => {
  let rating = null

  try {
    rating = await Rating.findOne(query, options)

    if (rating) {
      rating.theme = await getTheme({
        '_id': rating.theme,
      })

      rating.user = await User.findOne({
        '_id': rating.user,
      })
    }
  } catch (error) {
    raven.captureException(error)
  }

  return rating
}

export const getRatings = async (query, options = {}) => {
  options.populate = false
  const foundRatings = await getRating(query, options)

  if (foundRatings) {
    const ratings = await Promise.all(foundRatings.filter(async (rating) => {
      rating.theme = Theme.findOne({
        '_id': rating.theme,
      })

      rating.user = User.findOne({
        '_id': rating.user,
      })

      try {
        rating.value = JSON.stringify(rating.value)
      } catch (error) {
        rating.value = ''
      }

      return rating
    }))

    return ratings
  }

  return []
}
