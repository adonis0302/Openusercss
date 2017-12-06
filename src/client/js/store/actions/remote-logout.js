import gql from 'graphql-tag'

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
    throw new AuthenticationError(error.message)
  }

  return true
}

export default async ({commit, getters}) => {
  try {
    await remoteLogout(getters.session.token)
  } catch (error) {
    commit('actionError', error)
  }
  commit('logout')
  router.push('/login')
}
