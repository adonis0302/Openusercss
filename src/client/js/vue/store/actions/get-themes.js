import gql from 'graphql-tag'

import router from '../../router'
import {apolloClient} from '.'

const remoteLogin = async ({email, password}) => {
  const themesQuery = gql(`
    query {
      theme(email: "${email}", password: "${password}") {
        token,
        user {
          _id,
          displayname
        }
      }
    }
  `)

  let themes = null

  themes = await apolloClient.query({
    'query': themesQuery
  })

  return themes
}

export default async ({getters, commit}) => {
  let session = null

  commit('loading', true)

  try {
    session = await remoteLogin(getters.formData)
    commit('login', session)
    router.push('/')
  } catch (error) {
    commit('actionError', error.message)
  }

  commit('loading', false)
}
