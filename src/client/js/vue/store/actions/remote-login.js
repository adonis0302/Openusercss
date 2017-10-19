import gql from 'graphql-tag'
import log from 'chalk-console'

import {router} from '../../modules'
import {expected} from '../../../../../shared/custom-errors'
import {apolloClient} from '.'

const {AuthenticationError} = expected

const remoteLogin = async ({email, password}) => {
  const loginMutation = gql(`
    mutation {
      login(email: "${email}", password: "${password}") {
        token,
        expiresAt,
        createdAt,
        user {
          displayname
        }
      }
    }
  `)
  let session = null

  try {
    session = await apolloClient.mutate({
      'mutation': loginMutation
    })
  } catch (error) {
    log.error(error.message)
    throw new AuthenticationError(error.message)
  }

  return session
}

export default async ({getters, commit}, loginData) => {
  let session = null

  commit('loading', true)

  try {
    session = await remoteLogin(getters.formData)
    commit('login', session)
    router.push('/')
  } catch (error) {
    commit('actionError', error.message)

    setTimeout(() => {
      commit('actionError', null)
    }, 10000)
  }

  commit('loading', false)
}
