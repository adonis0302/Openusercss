import gql from 'graphql-tag'

import router from '../../router'
import {expected} from '../../../../shared/custom-errors'
import {apolloClient} from '.'

const {AuthenticationError} = expected

const remoteLogin = async ({email, password}) => {
  const loginMutation = gql(`
    mutation {
      login(email: "${email}", password: "${password}") {
        token,
        user {
          _id,
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
    throw new AuthenticationError(error.message)
  }

  return session
}

export default async ({getters, commit}) => {
  let session = null

  commit('loading', true)

  try {
    session = await remoteLogin(getters.formData)
    commit('login', session)
    router.push('/')
  } catch (error) {
    commit('actionError', error.message)
  }

  commit('loading', false)
}
