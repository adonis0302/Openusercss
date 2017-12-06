import gql from 'graphql-tag'
import {pick} from 'lodash'

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
        createdAt,
        scope
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

    result.data.latestThemes.forEach((theme) => {
      const savedTheme = pick(theme, [
        '_id',
        'title',
        'description',
        'lastUpdate',
        'createdAt',
        'scope'
      ])

      savedTheme.user = {
        '_id': theme.user._id
      }
      commit('themes', [
        savedTheme
      ])
      commit('users', [
        theme.user
      ])
    })
    commit('actionError', null)
  } catch (error) {
    commit('actionError', error)
  }

  commit('loading', false)
}
