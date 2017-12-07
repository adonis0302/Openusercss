import {pick} from 'lodash'
import {ExpectedError} from '../../../../shared/custom-errors'
import {apolloClient} from '.'
import {theme as query} from './queries'

const getFullTheme = async (id) => {
  let user = null

  try {
    user = await apolloClient.query({
      'query': query({id})
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
    const {data} = await getFullTheme(id)
    const {theme} = data
    const user = pick(theme.user, [
      '_id'
    ])
    const preparedTheme = pick(theme, [
      '__typename',
      '_id',
      'content',
      'createdAt',
      'description',
      'lastUpdate',
      'rating',
      'scope',
      'title',
      'version'
    ])

    preparedTheme.user = user
    commit('themes', [
      preparedTheme
    ])
    commit('actionError', null)
  } catch (error) {
    commit('actionError', error)
  }

  commit('loading', false)
}
