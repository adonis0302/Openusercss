import gql from 'graphql-tag'
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
        createdAt,
        lastUpdate,
        user {
          displayname
        }
      }
    }
  `)
  const existingMutation = gql(`
    mutation {
      theme(id: "${theme._id}", title: "${theme.title}", description: "${theme.description}", scope: "${theme.scope}", content: "${theme.content}", version: "${theme.version}", token: "${token}") {
        createdAt,
        lastUpdate,
        user {
          displayname
        }
      }
    }
  `)

  mutation = newMutation
  if (theme._id) {
    mutation = existingMutation
  }

  try {
    await apolloClient.mutate({
      mutation
    })
  } catch (error) {
    throw new ExpectedError({
      'message': error.message
    })
  }

  return true
}

export default async ({commit, getters}, {theme, redirect}) => {
  commit('loading', true)

  theme.content = theme.content.replace(/[\n]/g, '\\n')
  theme.content = theme.content.replace(/[']/g, '\'')
  theme.content = theme.content.replace(/["]/g, '\\"')
  theme.scope = theme.scope.replace(/\\/g, '\\\\')

  try {
    await createTheme(theme, getters.session.token)
    commit('actionError', null)
    router.push(redirect)
  } catch (error) {
    commit('actionError', error.message)
  }

  commit('loading', false)
}
