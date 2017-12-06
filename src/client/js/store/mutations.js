import {find, findIndex, defaultsDeep, uniq} from 'lodash'
import {struct} from 'superstruct'

/*
 * All mutations are synchronous
 */

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

validators.user = struct({
  '__typename':     'string?',
  '_id':            'string',
  'username':       'string?',
  'displayname':    'string?',
  'lastSeen':       'string?',
  'lastSeenReason': 'string?',
  'avatarUrl':      'string?',
  'smallAvatarUrl': 'string?',
  'themes':         struct.optional([
    validators.reference('Theme')
  ])
}, {
  '__typename': 'User'
})

validators.session = struct({
  '__typename': 'string?',
  'token':      'string',
  'user':       validators.reference('User')
}, {
  '__typename': 'Session'
})

export class IterableMutation {
  constructor (name, stateProperty) {
    return (state, dataList) => {
      if (!dataList || !(dataList instanceof Array)) {
        throw new Error(`${name} mutation must be passed an array, got ${typeof dataList}:\n${JSON.stringify(dataList)}`)
      }
      const validator = validators[name.toLowerCase()]

      dataList.forEach((rawData, index) => {
        const data = validator(rawData)

        if (data._id) {
          const existing = find(state[stateProperty], {
            '_id': data._id
          })

          if (!existing) {
            state[stateProperty].unshift(data)
          } else {
            const existingIndex = findIndex(state[stateProperty], {
              '_id': data._id
            })

            state[stateProperty][existingIndex] = defaultsDeep(data, state[stateProperty][existingIndex])
          }
        }
      })
    }
  }
}

export default {
  login (state, session) {
    state.session = validators.session(session)
  },

  logout (state) {
    state.session = null
  },

  actionError (state, error) {
    if (!(error instanceof Error) && error !== null) {
      throw new Error(`Argument passed to actionError must be of type Error, got ${JSON.stringify(error, null, 4)}`)
    }

    if (error) {
      state.actionErrors.push(error.message)
      state.actionErrors = uniq(state.actionErrors)
      if (process.browser) {
        // eslint-disable-next-line no-console
        console.error(error)
      }
    } else {
      state.actionErrors = []
    }
  },

  clearCache (state) {
    state.users = []
    state.themes = []
    state.actionErrors = []
    state.loading = false
  },

  deleteTheme (state, id) {
    if (typeof id !== 'string') {
      throw new Error('deleteTheme requires an ID string')
    }

    const index = findIndex(state.themes, {
      '_id': id
    })
    const theme = find(state.themes, {
      '_id': id
    })
    const user = find(state.users, {
      '_id': theme.user._id
    })
    const userIndex = findIndex(state.users, {
      '_id': theme.user._id
    })
    const userThemeIndex = findIndex(user.themes, {
      '_id': id
    })

    state.themes.splice(index, 1)
    state.users[userIndex].themes.splice(userThemeIndex, 1)
  },

  /* saveNewTheme (state, rawTheme) {
    const theme = validators.theme(rawTheme)

    state.themes.forEach((stateTheme, index) => {
      if (stateTheme._id === theme._id) {
        state.themes[index] = defaultsDeep(theme, state.themes[index])
      } else {
        state.themes.unshift(theme)
      }
    })

    const userIndex = find(state.users, {
      '_id': theme.user._id
    })

    state.users[userIndex].themes.push(theme)
  }, */

  loading (state, isLoading) {
    if (typeof isLoading !== 'boolean') {
      throw new Error('loading takes only boolean')
    }

    state.loading = isLoading
  },

  'users':  new IterableMutation('User', 'users'),
  'themes': new IterableMutation('Theme', 'themes')
}
