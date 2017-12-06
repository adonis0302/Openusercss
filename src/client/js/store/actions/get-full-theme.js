import gql from 'graphql-tag'
import {ExpectedError} from '../../../../shared/custom-errors'
import {apolloClient} from '.'

const getFullTheme = async (id) => {
  const query = gql(`
    query {
      theme(id: "${id}") {
        user {
          _id
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

    commit('themes', [
      result.data.theme
    ])
    commit('actionError', null)
  } catch (error) {
    commit('actionError', error)
  }

  commit('loading', false)
}
