import {struct} from 'superstruct'
import {pick, cloneDeep} from 'lodash'
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
  'title':       'string',
  'version':     'string',
  'content':     'string',
  'createdAt':   'string',
  'lastUpdate':  'string',
  'rating':      'number',
  'description': 'string',
  'screenshots': 'array',
  'options':     'array',
  'ratings':     'array',
  'user':        validators.user
}, {
  '__typename': 'Theme'
})

export const buildTheme = async (rawTheme) => {
  const builtTheme = cloneDeep(rawTheme)

  builtTheme._id = new ObjectID(rawTheme._id)
  builtTheme.user = pick(rawTheme.user, [
    '_schema',
    '__typename',
    '_id',
    'displayname'
  ])

  const theme = validators.theme(builtTheme)

  const header = [
    '/* ==userstyle==',
    `@name ${theme.title}`,
    `@description ${theme.description}`,
    `@version ${theme.version}`,
    `@namespace https://openusercss.org/theme/${theme._id}`,
    `@homepageURL https://openusercss.org/theme/${theme._id}`,
    `@author ${theme.user.displayname} (https://openusercss.org/profile/${theme.user._id})`
  ].join('\n')

  const rawVars = []

  theme.options.forEach((option) => {
    switch (option.type) {
    case 'checkbox':
      let defaultOption = 0

      if (option.default === 'checked') {
        defaultOption = 1
      }

      rawVars.push(`@var ${option.type} ${option.varname} "${option.title}" ${defaultOption}`)
      break
    case 'dropdown':
      rawVars.push(`@var select ${option.varname} "${option.title}" ${JSON.stringify(option.possibleValues)}`)
      break
    default:
      rawVars.push(`@var ${option.type} ${option.varname} "${option.title}" ${option.default}`)
      break
    }
  })
  const vars = [
    rawVars.join('\n'),
    '==/userstyle== */'
  ].join('\n')

  const body = [
    theme.content
  ]

  return [
    header,
    vars,
    body
  ].join('\n\n')
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
