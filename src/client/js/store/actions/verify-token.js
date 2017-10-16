import gql from 'graphql-tag'
import localStore from 'store2'
import log from 'chalk-console'

import {apolloClient} from '.'

const verifyToken = async (token) => {
  const query = gql(`{
    verifyToken(token: "${token}")
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

  if (session && !await verifyToken(session.auth.token)) {
    log.warn('Session token verification rejected by server')
    localStore.remove('session')
    context.commit('deleteSessionData')

    return false
  } else if (!session) {
    log.info('No token to verify')
    return false
  }

  log.info('Session token verified by server')
  return true
}
