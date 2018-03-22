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
    throw new Error('no-such-theme')
  }

  return result
}
