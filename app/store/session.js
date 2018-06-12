import {struct,} from 'superstruct'
import client from '~/../lib/apollo-client'

import loginMutation from '~/apollo/mutations/login.gql'
import logoutMutation from '~/apollo/mutations/logout.gql'
import verifyTokenQuery from '~/apollo/queries/verify-token.gql'

const validators = {}

validators.user = struct({
  '_id':            'string',
  'displayname':    'string',
  'username':       'string',
  'avatarUrl':      'string',
  'smallAvatarUrl': 'string',
  'lastSeen':       'string',
  'lastSeenReason': 'string',
  'createdAt':      'string',
  'lastUpdate':     'string',
  'bio':            'string',
  'donationUrl':    'string',
  '__typename':     'string?',
}, {
  '__typename': 'User',
})

validators.session = struct({
  '__typename': 'string?',
  '_id':        'string',
  'token':      'string',
  'ip':         'string',
  'ua':         'string',
  'expiresAt':  'string',
  'createdAt':  'string',
  'user':       validators.user,
}, {
  '__typename': 'Session',
})

export const state = () => ({
  'session': null,
  'viewer':  null,
  'loading': false,
})

export const getters = {
  loading (state) {
    return state.loading
  },
  token (state) {
    if (!state.session) {
      return null
    }

    return state.session.token
  },
  data (state) {
    return state.session
  },
  viewer (state) {
    return state.viewer
  },
}

export const mutations = {
  loading (state, isLoading) {
    state.loading = isLoading
  },
  login (state, session) {
    const fullSession = validators.session(session)

    state.viewer = fullSession.user
    Reflect.deleteProperty(fullSession, 'user')
    state.session = fullSession
  },
  logout (state) {
    state.session = null
    state.viewer = null
  },
}

export const actions = {
  async verify ({commit, getters,}) {
    commit('loading', true)

    try {
      await client.query({
        'query': verifyTokenQuery,
      })
    } catch (error) {
      commit('logout')
      throw error
    }

    commit('loading', false)
  },
  async login ({commit,}, loginData) {
    commit('loading', true)

    try {
      const {data,} = await client.mutate({
        'mutation':  loginMutation,
        'variables': loginData,
      })

      commit('login', data.login)
      commit('loading', false)
    } catch (error) {
      commit('loading', false)
      throw error
    }
  },
  async logout ({commit,}) {
    commit('loading', true)

    try {
      await client.mutate({
        'mutation': logoutMutation,
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }

    commit('loading', false)
    commit('logout')
  },
}
