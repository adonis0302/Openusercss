import localStore from 'store2'
import {union, pullAllBy} from 'lodash'
import log from 'chalk-console'

/*
 * All mutations are synchronous
 */

class IterableMutation {
  constructor (name, stateProperty) {
    return (state, dataList) => {
      if (!(dataList instanceof Array)) {
        const error = new Error(`${name} mutation must be passed an array, got ${typeof dataList}:\n${JSON.stringify(dataList)}`)

        log.error(error.stack)
        throw error
      }

      state[stateProperty] = pullAllBy(state[stateProperty], dataList, '_id')
      dataList.forEach((data) => {
        state[stateProperty].unshift(data)
      })

      while (state[stateProperty].length > 25) {
        state[stateProperty].splice(-1, 1)
      }
    }
  }
}

export default {
  login (state, {data}) {
    state.session = data.login
    if (data.login && data.login.user) {
      state.users[data.login.user._id] = data.login.user
    }

    localStore.set('session', data.login)
    state.actionErrors = []
  },

  logout (state) {
    state.session = null
  },

  actionError (state, message) {
    if (message) {
      state.actionErrors = union(state.actionErrors, [
        message
      ])
    } else {
      state.actionErrors = []
    }
  },

  loading (state, isLoading) {
    state.loading = isLoading
  },

  'users':  new IterableMutation('Users', 'users'),
  'themes': new IterableMutation('Themes', 'themes')

  /* users (state, data) {
    if (!(data instanceof Array)) {
      const error = new Error(`Users mutation must be passed an array, got ${typeof data}:\n${JSON.stringify(data)}`)

      log.error(error.stack)
      throw error
    }

    data.forEach((user) => {
      state.themes = uniqWith(flatten([state.themes, user]), isEqual)
    })
  },

  themes (state, data) {
    if (!(data instanceof Array)) {
      const error = new Error(`Themes mutation must be passed an array, got ${typeof data}:\n${JSON.stringify(data)}`)

      log.error(error.stack)
      throw error
    }

    data.forEach((theme) => {
      state.themes = uniqWith(flatten([state.themes, theme]), isEqual)
    })
  } */
}
