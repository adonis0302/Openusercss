import gql from 'graphql-tag'
import localStore from 'store2'
import log from 'chalk-console'

import {apolloClient} from '.'

const verifyToken = async (token) => {
  const query = gql(`{
    verifyToken(token: "${token}") {
      token
    }
  }`)
  let result = null

  try {
    result = await apolloClient.query({
      query
    })
  } catch (error) {
    result = false
  }

  return result
}

export default async (context) => {
  const session = localStore.get('session')

  try {
    if (session && !await verifyToken(session.token)) {
      log.warn('Session token rejected by server, forcing logout')
      localStore.remove('session')
      context.commit('logout')

      return false
    } else if (!session) {
      log.info('No token to verify')
      return false
    }
  } catch (error) {
    log.error(error)
    return false
  }

  log.info('Session token verified by server')
  return true
}
