import {superstruct,} from 'superstruct'
import {pick, cloneDeep, forOwn,} from 'lodash'
import stripDown from 'remove-markdown'
import unquote from 'unquote'

const struct = superstruct({
  'types': {
    stringOrObject (value) {
      const isObject = value instanceof Object && !(value instanceof Array)
      const isString = typeof value === 'string'

      return isObject || isString
    },
  },
})
const validators = {}

validators.reference = (typename) => {
  if (!typename || typeof typename !== 'string') {
    throw new Error(`typename argument must be a string, got ${typeof typename}: ${JSON.stringify(typename)}`)
  }

  return struct({
    '_schema':    'object',
    '__typename': 'string',
    '_id':        'object',
  }, {
    '__typename': typename,
  })
}

validators.option = struct({
  '__typename': 'string?',
  'type':       'string',
  'label':      'string',
  'name':       'string',
  'value':      'any',
})

validators.user = struct({
  '_schema':     'object?',
  '__typename':  'string?',
  '_id':         'stringOrObject',
  'displayname': 'string',
}, {
  '__typename': 'Theme',
})

validators.theme = struct({
  '_schema':     'object?',
  '__typename':  'string?',
  '_id':         'stringOrObject',
  'title':       'string',
  'version':     'string',
  'content':     'string',
  'createdAt':   'string',
  'lastUpdate':  'string',
  'description': 'string',
  'screenshots': 'array',
  'options':     [
    validators.option,
  ],
  'user': validators.user,
}, {
  '__typename': 'Theme',
})

let urls = {
  'api':  'https://api.openusercss.org',
  'site': 'https://openusercss.org',
}

if (
  process.env.NODE_ENV === 'development'
  || process.env.NODE_ENV === 'test'
) {
  urls = {
    'api':  'http://localhost:5000',
    'site': 'http://localhost:5010',
  }
}

export const buildTheme = async (rawTheme, user) => {
  const builtTheme = cloneDeep(rawTheme)

  Reflect.deleteProperty(builtTheme, 'meta')
  Reflect.deleteProperty(builtTheme, '$loki')
  builtTheme._id = rawTheme._id
  builtTheme.user = pick(user, [
    '_schema',
    '__typename',
    '_id',
    'displayname',
  ])

  const theme = validators.theme(builtTheme)

  const header = [
    '/* ==userstyle==',
    `@name ${theme.title}`,
    `@description ${stripDown(theme.description).replace(/\n/g, ' ')}`,
    `@version ${theme.version}`,
    `@namespace ${urls.site}/theme/${theme._id}`,
    `@homepageURL ${urls.site}/theme/${theme._id}`,
    `@author ${theme.user.displayname} (${urls.site}/profile/${theme.user._id})`,
    `@updateURL ${urls.api}/theme/${theme._id}.user.css`,
    '@preprocessor uso',
  ].join('\n')

  const rawVars = []

  theme.options.forEach((option) => {
    switch (option.type) {
    case 'select':
      let values = option.value
      let finalValues = null

      if (typeof option.value === 'string') {
        values = JSON.parse(option.value)
      }

      if (values[0].label) {
        finalValues = {}

        forOwn(values, (value, index) => {
          finalValues[value.label] = value.value
        })
      } else {
        finalValues = values
      }

      rawVars.push(`@var select ${option.name} "${option.label}" ${JSON.stringify(finalValues, null, 4)}`)
      break
    case 'checkbox':
      option.value = unquote(option.value)
      let isChecked = 0

      if (option.value === 'checked') {
        isChecked = 1
      }

      rawVars.push(`@var ${option.type} ${option.name} "${option.label}" ${isChecked}`)
      break
    default:
      option.value = unquote(option.value)
      rawVars.push(`@var ${option.type} ${option.name} "${option.label}" ${option.value}`)
      break
    }
  })
  const vars = [
    rawVars.join('\n'),
    '==/userstyle== */',
  ].join('\n')

  const body = [
    theme.content,
  ]

  return [
    header,
    vars,
    body,
  ].join('\n\n')
}
