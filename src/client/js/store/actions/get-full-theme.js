import gql from 'graphql-tag'
import log from 'chalk-console'
import {ExpectedError} from '../../../../shared/custom-errors'
import {apolloClient} from '.'

const getFullTheme = async (id) => {
  const query = gql(`
    query {
      theme(id: "${id}") {
        user {
          _id,
          username,
          displayname,
          avatarUrl,
          smallAvatarUrl
        },
        _id,
        title,
        description,
        content,
        createdAt,
        lastUpdate,
        rating,
        scope,
        version
      }
    }
  `)
  let user = null

  try {
    user = await apolloClient.query({
      query
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
    const result = await getFullTheme(id)

    commit('themes', result.data.theme)
    commit('actionError', null)
  } catch (error) {
    let errors = []

    try {
      if (typeof error.message === 'string') {
        errors.push({
          'text': error.message
        })
      } else {
        errors = JSON.parse(error.message)
      }
    } catch (err) {
      log.error(err)
    }

    errors.forEach((message) => {
      if (message.line) {
        commit('actionError', `${message.text} on line ${message.line}`)
      } else {
        commit('actionError', message.text)
      }
    })
  }

  commit('loading', false)
}
