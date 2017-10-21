import gql from 'graphql-tag'
import localStore from 'store2'
import log from 'chalk-console'

import {expected} from '../../../../../shared/custom-errors'
import router from '../../router'
import {apolloClient} from '.'

const {AuthenticationError} = expected

const remoteLogout = async (token) => {
  const logoutMutation = gql(`
    mutation {
      logout(token: "${token}")
    }
  `)

  try {
    const result = await apolloClient.mutate({
      'mutation': logoutMutation
    })

    if (!result.data.logout) {
      throw new AuthenticationError('Failed to shred session')
    }
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
