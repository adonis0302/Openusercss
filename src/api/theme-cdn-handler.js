import {struct} from 'superstruct'
import Theme from './connector/schema/theme'

const validators = {}

validators.reference = (typename) => {
  if (!typename || typeof typename !== 'string') {
    throw new Error(`typename argument must be a string, got ${typeof typename}: ${JSON.stringify(typename)}`)
  }

  return struct({
    '__typename': 'string',
    '_id':        'string'
  }, {
    '__typename': typename
  })
}

validators.theme = struct({
  '__typename':  'string?',
  '_id':         'string',
  'title':       'string?',
  'scope':       'string?',
  'version':     'string?',
  'content':     'string?',
  'createdAt':   'string?',
  'lastUpdate':  'string?',
  'rating':      'number?',
  'description': 'string?',
  'user':        validators.reference('User')
}, {
  '__typename': 'Theme'
})

export const buildTheme = async (rawTheme) => {
  const theme = validators.theme(rawTheme)

  let response = '/* ==userstyle==\n'

  response = `${response}@name ${theme.title}\n`
  response = `${response}@description ${theme.description}\n`
  response = `${response}@version ${theme.version}\n`
  response = `${response}@namespace https://openusercss.org/theme/${theme._id}\n`
  response = `${response}@homepageURL https://openusercss.org/theme/${theme._id}\n`
  response = `${response}@author ${theme.user.displayname} (https://openusercss.org/profile/${theme.user._id})\n`
  response = `${response}==/userstyle== */\n`
  response = `${response}\n@-moz-document regexp("${theme.scope}") {\n`
  response = `${response}${theme.content.replace(/^/gm, '\ \ ')}\n}\n`

  return response
}

export default async (req, res, next) => {
  const foundTheme = await Theme.findOne({
    '_id': req.params.id
  })

  if (foundTheme) {
    const theme = await buildTheme(foundTheme)

    res.type('css')
    res.send(theme)
  } else {
    res.type('json')
    res.send({
      'errors': [
        {
          'message': 'No theme found',
          'id':      req.params.id
        }
      ]
    })
  }
}
