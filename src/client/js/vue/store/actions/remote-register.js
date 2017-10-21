import gql from 'graphql-tag'
import log from 'chalk-console'

import router from '../../router'
import {apolloClient} from '.'

const remoteRegister = async ({email, password, displayname}) => {
  const registerMutation = gql(`
    mutation {
      register(displayname: "${displayname}", email: "${email}", password: "${password}") {
        username
      }
    }
  `)
  let token = null

  try {
    token = await apolloClient.mutate({
      'mutation': registerMutation
    })
  } catch (error) {
    log.error(error.message)
    throw new Error(error.message)
  }

  return token
}

export default async ({getters, commit}, registerData) => {
  commit('loading', true)

  try {
    await remoteRegister(getters.formData)
    router.push('/login')
  } catch (error) {
    commit('actionError', error.message)
  }

  commit('loading', false)
}
