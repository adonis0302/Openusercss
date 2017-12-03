import gql from 'graphql-tag'
import log from 'chalk-console'

import {expected} from '../../../../shared/custom-errors'
import router from '../../router'
import {apolloClient} from '.'

const {AuthenticationError} = expected

const remoteLogout = async (token) => {
  const mutation = gql(`
    mutation {
      logout(token: "${token}")
    }
  `)

  try {
    const result = await apolloClient.mutate({
      mutation
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
  await remoteLogout(context.getters.session.token)
  context.commit('logout')
  router.push('/login')
}
