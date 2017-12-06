import {find, findIndex, defaultsDeep} from 'lodash'
import {struct} from 'superstruct'

/*
 * All mutations are synchronous
 */

const validators = {}

validators.reference = struct({
  '__typename': 'string',
  '_id':        'string'
})

validators.theme = struct({
  '__typename': 'string',
  '_id':        'string',
  'title':      'string',
  'scope':      'string',
  'version':    'string',
  'content':    'string',
  'createdAt':  'string',
  'lastUpdate': 'string',
  'rating':     'number',
  'user':       validators.reference
})

validators.user = struct({
  '__typename':     'string',
  '_id':            'string',
  'username':       'string',
  'displayname':    'string',
  'lastSeen':       'string',
  'lastSeenReason': 'string',
  'avatarUrl':      'string',
  'smallAvatarUrl': 'string'
})

export class IterableMutation {
  constructor (name, stateProperty) {
    return (state, dataList) => {
      if (!(dataList instanceof Array)) {
        throw new Error(`${name} mutation must be passed an array, got ${typeof dataList}:\n${JSON.stringify(dataList)}`)
      }

      dataList.forEach((data, index) => {
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
    state.session = session
  },

  logout (state) {
    state.session = null
  },

  actionError (state, error) {
    if (!(error instanceof Error) && error !== null) {
      throw new Error(`Argument passed to actionError must be of type Error, got ${JSON.stringify(error, null, 4)}`)
    }

    if (error) {
      state.actionErrors.push(error)
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

  saveTheme (state, theme) {
    state.themes.forEach((stateTheme, index) => {
      if (stateTheme._id === theme._id) {
        state.themes[index] = defaultsDeep(theme, state.themes[index])
      } else {
        state.themes.unshift(theme)
      }
    })
  },

  loading (state, isLoading) {
    state.loading = isLoading
  },

  'users':  new IterableMutation('Users', 'users'),
  'themes': new IterableMutation('Themes', 'themes')
}
