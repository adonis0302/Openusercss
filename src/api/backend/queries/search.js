export default async (root, {terms, limit = 10, skip = 0}, {Theme, User}) => {
  if (limit > 25 || limit < 1) {
    throw new Error(`limit must be at least 1 and at most 25, got ${limit}`)
  }

  const themeResults = await Theme.find({
    '$text': {
      '$search': terms
    }
  }, {
    'populate': true,
    'sort':     '-score',
    limit,
    skip
  })
  let userResults = await User.find({
    '$text': {
      '$search': terms
    }
  }, {
    'populate': true,
    'sort':     '-score',
    limit,
    skip
  })

  userResults = await Promise.all(userResults.map(async (user, index) => {
    const userThemes = []

    user.themes.forEach((theme) => {
      userThemes.push(Theme.findOne({
        '_id': theme._id
      }, {
        'populate': true
      }))
    })
    user.themes = await Promise.all(userThemes)

    return user
  }))

  const results = {
    'users':  userResults,
    'themes': themeResults
  }

  return results
}
