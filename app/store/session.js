import {struct,} from 'superstruct'
import gql from 'graphql-tag'

import client from '~/../lib/apollo-client'

const validators = {}

validators.sessionUser = struct({
  '_id':         'string',
  'displayname': 'string',
  '__typename':  'string?',
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
  'user':       validators.sessionUser,
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
        'query': gql`
          query {
            verifyToken {
              _id
            }
          }
        `,
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
        'mutation': gql`
        mutation(
          $password: String!
          $email:    String!
        ) {
          login(
            password: $password
            email:    $email
          ) {
            _id
            user {
              _id
              displayname
            }
            token
            expiresAt
            createdAt
            ip
            ua
          }
        }
        `,
        'variables': loginData,
      })

      commit('users/upsert', data.login.user, {
        'root': true,
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
        'mutation': gql`
        mutation {
          logout
        }
        `,
      })

      commit('logout')
      commit('loading', false)
    } catch (error) {
      commit('loading', false)
      throw error
    }
  },
}
