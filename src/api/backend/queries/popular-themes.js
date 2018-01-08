import {getRatings,} from '../translators/get-rating'

export default async (root, {limit,}, {User, Theme, Rating,}) => {
  const upperLimit = 25
  const lowerLimit = 1

  if (limit > upperLimit || limit < lowerLimit) {
    throw new Error(`limit must be at most ${upperLimit} and at least ${lowerLimit}`)
  }

  let result = null

  try {
    result = await Theme.find({}, {
      limit,
      'populate': true,
      'sort':     '-ratings',
    })
  } catch (error) {
    result = []
  }

  if (!result) {
    throw new Error('No theme found')
  }

  result = await Promise.all(result.map(async (theme) => {
    theme.ratings = await getRatings({
      'theme': theme._id,
    })

    return theme
  }))

  return result
}
