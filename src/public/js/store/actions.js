import {forOwn, defaultsDeep} from 'lodash'
import ApolloClient, {createBatchingNetworkInterface} from 'apollo-client'
import gql from 'graphql-tag'
import log from 'chalk-console'

import {AuthenticationError} from '../../../utils/custom-errors'

const networkInterface = createBatchingNetworkInterface({
  'uri': '/graphql'
})
const apolloClient = new ApolloClient({
  networkInterface
})

const remoteLogin = async ({email, password}) => {
  const loginMutation = gql(`
    mutation {
      login(email: "${email}", password: "${password}") {
        auth {
          token
          userId
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

export default {
  async login ({getters, commit}, loginData) {
    let token = null

    try {
      token = await remoteLogin(getters.formData)
      commit('login', token)
    } catch (error) {
      commit('loginFailure', error.message)
    }
  },

  async updateFormData (context, data) {
    let formData = {}

    forOwn(data, (event, key) => {
      if (event.srcElement) {
        formData = defaultsDeep({
          [event.srcElement.name]: event.target.value
        }, formData)
        context.commit('updateFormData', formData)
      }
    })
  }
}
