import gql from 'graphql-tag'
import router from '../../router'
import {ExpectedError} from '../../../../shared/custom-errors'
import {apolloClient} from '.'

const deleteTheme = async (id, token) => {
  const mutation = gql(`
    mutation {
      deleteTheme(id: "${id}", token: "${token}")
    }
  `)
  let success = null

  try {
    success = await apolloClient.mutate({
      mutation
    })
  } catch (error) {
    throw new ExpectedError({
      'message': error.message
    })
  }

  return success
}

export default async ({commit, getters}, {id, redirect}) => {
  commit('loading', true)

  try {
    await deleteTheme(id, getters.session.token)
    commit('actionError', null)
    router.push(redirect)
  } catch (error) {
    commit('actionError', error.message)
  }

  commit('loading', false)
}
