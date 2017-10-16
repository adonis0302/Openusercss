import gql from 'graphql-tag'
import localStore from 'store2'
import log from 'chalk-console'

import {AuthenticationError} from '../../../../utils/custom-errors'
import {router} from '../../vue-modules'
import {apolloClient} from '.'

const remoteLogout = async (token) => {
  const logoutMutation = gql(`
    mutation {
      logout(token: "${token}")
    }
  `)

  try {
    await apolloClient.mutate({
      'mutation': logoutMutation
    })
  } catch (error) {
    log.error(error.message)
    throw new AuthenticationError(error.message)
  }

  return true
}

export default async (context) => {
  await remoteLogout(context.getters.token)
  context.commit('logout')
  localStore.remove('session')
  router.push('/login')
}
