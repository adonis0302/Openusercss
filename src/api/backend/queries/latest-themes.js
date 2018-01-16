import {getTheme,} from '../translators/get-theme'

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
      'populate': false,
      'sort':     '-createdAt',
    })
  } catch (error) {
    result = []
  }

  if (!result) {
    throw new Error('No theme found')
  }

  result = await Promise.all(result.map((theme) => {
    return getTheme({
      '_id': theme._id,
    })
  }))

  return result
}
