import gql from 'graphql-tag'
import {apolloClient} from '.'

const verify = async (token) => {
  const query = gql(`{
    verifyToken(token: "${token}") {
      user {
        _id
      },
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
  commit('loading', true)

  try {
    const session = getters.session

    if (!session) {
      commit('loading', false)
      return false
    }

    const {data} = await verify(session.token)
    const {verifyToken} = data

    if (!verifyToken) {
      commit('logout')
    } else {
      commit('users', [
        {
          '_id': verifyToken.user._id
        }
      ])
    }
  } catch (error) {
    commit('actionError', error)
  }

  commit('loading', false)
}
