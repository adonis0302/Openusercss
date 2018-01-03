import {struct} from 'superstruct'
import raven from 'raven-js'

/*
 * All mutations are synchronous
 */

const validators = {}

validators.reference = (typename) => {
  if (!typename || typeof typename !== 'string') {
    throw new Error(`typename argument must be a string, got ${typeof typename}: ${JSON.stringify(typename)}`)
  }

  return struct({
    '_id': 'string'
  })
}

validators.session = struct({
  'token': 'string',
  'ip':    'string',
  'ua':    'string',
  'user':  validators.reference('User')
})

export default {
  login (state, session) {
    state.session = validators.session(session)
  },

  logout (state) {
    state.session = null
  },

  actionError (state, error) {
    if (error && !error.message) {
      throw new Error(`Argument passed to actionError must have a message property, got ${error}`)
    }

    if (error && process.browser) {
      const toast = require('izitoast')

      // eslint-disable-next-line no-console
      console.error(error)
      raven.captureException(error)
      toast.error({
        'title':   'An error occurred within the application:',
        'message': error.message,
        'timeout': 10000,
        'theme':   'ouc',
        'layout':  2,
        'buttons': [
          [
            '<button type="button" class="button is-danger has-text-white">Send feedback</button>',
            (instance, notification) => {
              if (raven.isSetup()) {
                raven.showReportDialog()
              } else {
                toast.error({
                  'title':   'Thank you, but...',
                  'message': 'Error reporting is disabled in development builds.',
                  'timeout': 10000,
                  'theme':   'ouc',
                  'layout':  2
                })
              }
            }
          ]
        ]
      })
    }
  },

  clearCache (state) {
    state.actionErrors = []
    state.loading = false
  },

  /* deleteTheme (state, id) {
    if (typeof id !== 'string') {
      throw new Error('deleteTheme requires an ID string')
    }
    const themes = db.getCollection('themes')
    const users = db.getCollection('users')

    const theme = themes.findOne({
      '_id': id
    })
    const user = users.findOne({
      '_id': theme.user._id
    })

    themes.remove(theme)
    const userThemeIndex = findIndex(user.themes, {
      '_id': id
    })

    user.themes.splice(userThemeIndex, 1)
    users.update(user)
  }, */

  loading (state, isLoading) {
    if (typeof isLoading !== 'boolean') {
      throw new Error('loading takes only boolean')
    }

    state.loading = isLoading
  }
}
