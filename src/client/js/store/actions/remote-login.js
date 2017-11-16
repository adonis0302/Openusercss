import gql from 'graphql-tag'

import router from '../../router'
import {expected} from '../../../../shared/custom-errors'
import {apolloClient} from '.'

const {AuthenticationError} = expected

const remoteLogin = async ({email, password}) => {
  const mutation = gql(`
    mutation {
      login(email: "${email}", password: "${password}") {
        token,
        user {
          themes {
            _id,
            title,
            description,
            createdAt,
            lastUpdate,
            rating
          },
          _id,
          displayname,
          username,
          avatarUrl,
          smallAvatarUrl,
          lastSeen,
          lastSeenReason
        }
      }
    }
  `)
  let session = null

  try {
    session = await apolloClient.mutate({
      mutation
    })
  } catch (error) {
    throw new AuthenticationError(error.message)
  }

  return session
}

export default async ({commit}, login) => {
  let session = null

  commit('loading', true)

  try {
    session = await remoteLogin(login)
    commit('login', session)
    router.push('/')
  } catch (error) {
    commit('actionError', error.message)
  }

  commit('loading', false)
}
