import {getUser, getUsers,} from '../translators/get-user'
import {getTheme, getThemes,} from '../translators/get-theme'

export default async (root, {terms, limit = 10, skip = 0,}, {Theme, User,}) => {
  if (limit > 25 || limit < 1) {
    throw new Error(`limit must be at least 1 and at most 25, got ${limit}`)
  }

  let themeResults = await getThemes({
    '$text': {
      '$search': terms,
    },
  }, {
    'sort':     '-score',
    limit,
    skip,
  })
  let userResults = await getUsers({
    '$text': {
      '$search': terms,
    },
  }, {
    'sort':     '-score',
    limit,
    skip,
  })

  userResults = await Promise.all(userResults.map(async (user, index) => {
    return getUser({
      '_id': user._id,
    })
  }))

  themeResults = await Promise.all(themeResults.map(async (theme, index) => {
    return getTheme({
      '_id': theme._id,
    })
  }))

  const results = {
    'users':  userResults,
    'themes': themeResults,
  }

  return results
}
