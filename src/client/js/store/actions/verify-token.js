import gql from 'graphql-tag'
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

export default async ({commit, getters}) => {
  const session = getters.session

  try {
    if (session && !await verifyToken(session.token)) {
      commit('logout')

      return false
    } else if (!session) {
      return false
    }
  } catch (error) {
    commit('actionError', error.message)
    return false
  }

  return true
}
