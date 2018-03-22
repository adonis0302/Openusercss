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
})

export const getters = {
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
  login (state, session) {
    const fullSession = validators.session(session)

    state.viewer = fullSession.user
    Reflect.deleteProperty(fullSession, 'user')
    state.session = fullSession
  },
  logout (state) {
    state.session = null
  },
}

export const actions = {
  async verifyToken ({commit, getters,}) {

  },
  async login ({commit,}, loginData) {
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

    commit('login', data.login)
  },
  async logout ({commit,}) {
    const {data,} = await client.mutate({
      'mutation': gql`
        mutation {
          logout
        }
      `,
    })

    console.log(data)
  },
}
