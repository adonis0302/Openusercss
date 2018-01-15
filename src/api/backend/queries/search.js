import raven from 'raven'
import {getUsers,} from '../translators/get-user'
import {getThemes,} from '../translators/get-theme'

export default async (root, {terms, limit = 10, skip = 0,}, {Theme, User,}) => {
  if (limit > 25 || limit < 1) {
    throw new Error(`limit must be at least 1 and at most 25, got ${limit}`)
  }

  try {
    const themeResults = await getThemes({
      '$text': {
        '$search': terms,
      },
    }, {
      'sort': '-score',
      limit,
      skip,
    })
    const userResults = await getUsers({
      '$text': {
        '$search': terms,
      },
    }, {
      'sort': '-score',
      limit,
      skip,
    })

    return {
      'users':  userResults,
      'themes': themeResults,
    }
  } catch (error) {
    raven.captureException(error)
  }
}
