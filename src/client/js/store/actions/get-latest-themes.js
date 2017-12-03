import gql from 'graphql-tag'
import log from 'chalk-console'
import {ExpectedError} from '../../../../shared/custom-errors'
import {apolloClient} from '.'

const getLatestThemes = async (limit) => {
  const query = gql(`
    query {
      latestThemes(limit: ${limit}) {
        user {
          _id,
          displayname
        },
        _id,
        title,
        description,
        lastUpdate,
        createdAt
      }
    }
  `)
  let themes = null

  try {
    themes = await apolloClient.query({
      query
    })
  } catch (error) {
    throw new ExpectedError({
      'message': error.message
    })
  }

  return themes
}

export default async ({commit, getters}, id) => {
  commit('loading', true)

  try {
    const result = await getLatestThemes(id)

    commit('themes', result.data.latestThemes)
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
