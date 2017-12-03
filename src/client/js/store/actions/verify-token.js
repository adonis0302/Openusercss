import gql from 'graphql-tag'
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
  const session = context.getters.session

  try {
    if (session && !await verifyToken(session.token)) {
      log.warn('Session token rejected by server, forcing logout')
      context.commit('logout')

      return false
    } else if (!session) {
      return false
    }
  } catch (error) {
    log.error(error)
    return false
  }

  log.info('Session token verified by server')
  return true
}
