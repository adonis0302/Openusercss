import gql from 'graphql-tag'
import log from 'chalk-console'
import {ExpectedError} from '../../../../shared/custom-errors'
import {apolloClient} from '.'

const getFullUser = async (id) => {
  const userQuery = gql(`
    query {
      user(id: "${id}") {
        _id,
        displayname,
        username,
        avatarUrl,
        smallAvatarUrl,
        lastSeen,
        lastSeenReason,
        themes {
          title,
          description,
          createdAt,
          lastUpdate,
          rating
        }
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

    commit('viewedUser', result.data.user)
    commit('actionError', null)
  } catch (error) {
    let errors = []

    try {
      errors = JSON.parse(error.message)
    } catch (err) {
      log.error(err)
    }

    errors.forEach((message) => {
      commit('actionError', `${message.text} on line ${message.line}`)
    })
  }

  commit('loading', false)
}
