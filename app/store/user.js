import createPersistedState from 'vuex-persistedstate'
import localforage from 'localforage'
import {struct,} from 'superstruct'

const validators = {}

validators.reference = (typename) => {
  if (!typename || typeof typename !== 'string') {
    throw new Error(`typename argument must be a string, got ${typeof typename}: ${JSON.stringify(typename)}`)
  }

  return struct({
    '_id': 'string',
  })
}

validators.session = struct({
  'token': 'string',
  'ip':    'string',
  'ua':    'string',
  'user':  validators.reference('User'),
})

export const plugins = []

if (process.client) {
  plugins.push(createPersistedState({
    'storage': localforage,
  }))
}

export const state = () => ({
  'session': false,
})

export const mutations = {
  login (state, session) {
    state.session = validators.session(session)
  },
}

export const getters = {
  session (state) {
    return state.session
  },
}

export const actions = {
  async verifyToken ({commit, getters,}) {

  },
}
