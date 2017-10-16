import gql from 'graphql-tag'
import log from 'chalk-console'

import {router} from '../../vue-modules'
import {AuthenticationError} from '../../../../shared/custom-errors'
import {apolloClient} from '.'

const remoteLogin = async ({email, password}) => {
  const loginMutation = gql(`
    mutation {
      login(email: "${email}", password: "${password}") {
        auth {
          token
          userId
        }
        user {
          displayname
        }
      }
    }
  `)
  let token = null

  try {
    token = await apolloClient.mutate({
      'mutation': loginMutation
    })
  } catch (error) {
    log.error(error.message)
    throw new AuthenticationError(error.message)
  }

  return token
}

export default async ({getters, commit}, loginData) => {
  let token = null

  try {
    token = await remoteLogin(getters.formData)
    commit('login', token)
    router.push('/')
  } catch (error) {
    commit('loginFailure', error.message)
  }
}
