export default async (root, {terms, limit = 10, skip = 0}, {Theme, User}) => {
  if (limit > 25 || limit < 1) {
    throw new Error(`limit must be at least 1 and at most 25, got ${limit}`)
  }

  const themeResults = await Theme.find({
    '$text': {
      '$search': terms
    }
  }, {
    'sort': '-score',
    limit,
    skip
  })
  const userResults = await User.find({
    '$text': {
      '$search': terms
    }
  }, {
    'sort': '-score',
    limit,
    skip
  })
  const results = {
    'users':  userResults,
    'themes': themeResults
  }

  return results
}
