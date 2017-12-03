import gql from 'graphql-tag'
import log from 'chalk-console'
import router from '../../router'
import {ExpectedError} from '../../../../shared/custom-errors'
import {apolloClient} from '.'

const createTheme = async (theme, token) => {
  if (!theme || !theme.content) {
    throw new Error('No content')
  }

  const mutation = gql(`
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
    log.error(error)
    const errors = JSON.parse(error.message)

    errors.forEach((message) => {
      commit('actionError', `${message.text} on line ${message.line}`)
    })
  }

  commit('loading', false)
}
