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
      'sort':     '-createdAt',
    })
  } catch (error) {
    result = []
  }

  if (!result) {
    throw new Error('No theme found')
  }

  result = await Promise.all(result.map(async (theme) => {
    theme.ratings = await getRatings({
      'user': theme.user._id,
    })

    theme.options = theme.options.filter((option) => {
      option.value = JSON.stringify(option.value)

      return option
    })

    return theme
  }))

  return result
}
