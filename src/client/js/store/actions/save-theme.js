import gql from 'graphql-tag'
import {defaultsDeep} from 'lodash'
import router from '../../router'
import {ExpectedError} from '../../../../shared/custom-errors'
import {apolloClient} from '.'

const createTheme = async (theme, token) => {
  if (!theme || !theme.content) {
    throw new Error('No content')
  }

  let mutation = null
  const newMutation = gql(`
    mutation {
      theme(title: "${theme.title}", description: "${theme.description}", scope: "${theme.scope}", content: "${theme.content}", version: "${theme.version}", token: "${token}") {
        _id,
        createdAt,
        lastUpdate,
        user {
          _id
        }
      }
    }
  `)
  const existingMutation = gql(`
    mutation {
      theme(id: "${theme._id}", title: "${theme.title}", description: "${theme.description}", scope: "${theme.scope}", content: "${theme.content}", version: "${theme.version}", token: "${token}") {
        _id,
        createdAt,
        lastUpdate,
        user {
          _id
        }
      }
    }
  `)

  mutation = newMutation
  if (theme._id) {
    mutation = existingMutation
  }

  let savedTheme = {}

  try {
    savedTheme = await apolloClient.mutate({
      mutation
    })
  } catch (error) {
    throw new ExpectedError({
      'message': error.message
    })
  }

  return savedTheme
}

export default async ({commit, getters}, {readyTheme, redirect}) => {
  commit('loading', true)

  readyTheme.content = readyTheme.content.replace(/[\n]/g, '\\n')
  readyTheme.content = readyTheme.content.replace(/[']/g, '\'')
  readyTheme.content = readyTheme.content.replace(/["]/g, '\\"')
  readyTheme.scope = readyTheme.scope.replace(/\\/g, '\\\\')

  try {
    const {data} = await createTheme(readyTheme, getters.session.token)
    const {theme} = data

    commit('themes', [
      defaultsDeep(theme, readyTheme)
    ])
    commit('users', [
      {
        '_id':    theme.user._id,
        'themes': [
          {
            '_id': theme._id
          }
        ]
      }
    ])
    commit('actionError', null)
    router.push(redirect)
  } catch (error) {
    commit('actionError', error)
  }

  commit('loading', false)
}
