import Rating from '../../connector/schema/rating'

import getTheme from './get-theme'
import getUser from './get-user'

export default async (query) => {
  const rating = await Rating.findOne(query, {
    'populate': true
  })

  if (rating) {
    rating.theme = await getTheme({
      '_id': rating.theme
    })

    rating.user = await getUser({
      '_id': rating.user
    })
  }

  return rating
}

export const getRatings = async (query) => {
  let ratings = await Rating.find(query, {
    'populate': true
  })

  if (ratings.length) {
    ratings = Promise.all(ratings.map(async (rating) => {
      rating.theme = await getTheme({
        '_id': rating.theme
      })

      rating.user = await getUser({
        '_id': rating.user
      })

      return rating
    }))
  }

  return ratings
}
