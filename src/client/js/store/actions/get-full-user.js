import gql from 'graphql-tag'
import {ExpectedError} from '../../../../shared/custom-errors'
import {apolloClient} from '.'

const getFullUser = async (id) => {
  const userQuery = gql(`
    query {
      user(id: "${id}") {
        themes {
          _id,
          title,
          description,
          createdAt,
          lastUpdate,
          scope,
          rating
        },
        _id,
        displayname,
        username,
        avatarUrl,
        smallAvatarUrl,
        lastSeen,
        lastSeenReason
      }
    }
  `)
  let user = null

  try {
    user = await apolloClient.query({
      'query': userQuery
    })
  } catch (error) {
    throw new ExpectedError({
      'message': error.message
    })
  }

  return user
}

export default async ({commit, getters}, id) => {
  commit('loading', true)

  try {
    const result = await getFullUser(id)

    commit('users', [
      result.data.user
    ])
    commit('actionError', null)
  } catch (error) {
    commit('actionError', error.message)
  }

  commit('loading', false)
}
