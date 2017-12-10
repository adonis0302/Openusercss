import {struct} from 'superstruct'
import {pick} from 'lodash'
import {ObjectID} from 'mongodb'

import Theme from './connector/schema/theme'

const validators = {}

validators.reference = (typename) => {
  if (!typename || typeof typename !== 'string') {
    throw new Error(`typename argument must be a string, got ${typeof typename}: ${JSON.stringify(typename)}`)
  }

  return struct({
    '_schema':    'object',
    '__typename': 'string',
    '_id':        'object'
  }, {
    '__typename': typename
  })
}

validators.user = struct({
  '_schema':     'object',
  '__typename':  'string?',
  '_id':         'object',
  'displayname': 'string'
}, {
  '__typename': 'Theme'
})

validators.theme = struct({
  '_schema':     'object',
  '__typename':  'string?',
  '_id':         'object',
  'title':       'string?',
  'version':     'string?',
  'content':     'string?',
  'createdAt':   'string?',
  'lastUpdate':  'string?',
  'rating':      'number?',
  'description': 'string?',
  'screenshots': 'array?',
  'user':        validators.user
}, {
  '__typename': 'Theme'
})

export const buildTheme = async (rawTheme) => {
  const builtTheme = pick(rawTheme, [
    '_schema',
    '__typename',
    'title',
    'version',
    'content',
    'createdAt',
    'lastUpdate',
    'description'
  ])

  builtTheme._id = new ObjectID(rawTheme._id)
  builtTheme.user = pick(rawTheme.user, [
    '_schema',
    '__typename',
    '_id',
    'displayname'
  ])

  const theme = validators.theme(builtTheme)
  let response = '/* ==userstyle==\n'

  response = `${response}@name ${theme.title}\n`
  response = `${response}@description ${theme.description}\n`
  response = `${response}@version ${theme.version}\n`
  response = `${response}@namespace https://openusercss.org/theme/${theme._id}\n`
  response = `${response}@homepageURL https://openusercss.org/theme/${theme._id}\n`
  response = `${response}@author ${theme.user.displayname} (https://openusercss.org/profile/${theme.user._id})\n`
  response = `${response}==/userstyle== */\n\n`
  response = `${response}${theme.content}\n`

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
    res.status('404')
    res.send({
      'data':   null,
      'errors': [
        {
          'code':    'ENOTFOUND',
          'message': 'No theme found',
          'id':      req.params.id
        }
      ]
    })
  }
}
