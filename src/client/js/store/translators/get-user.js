import {cloneDeep,} from 'lodash'
import {apolloClient,} from '../actions'
import {ServerError,} from '../../../../shared/custom-errors'
import {user, search,} from '../actions/helpers/queries'
import {upsert,} from '../db'

export const getUser = async (id) => {
  let userResult = null

  try {
    userResult = await apolloClient.query({
      'query':     user,
      'variables': {
        id,
      },
    })
  } catch (error) {
    throw new ServerError(error)
  }

  upsert('users', cloneDeep(userResult.data.user))
  return userResult.data.user
}

export const getUsers = async (variables) => {
  let searchResults = null

  try {
    searchResults = await apolloClient.query({
      'query': search,
      variables,
    })
  } catch (error) {
    throw new ServerError({
      'message': error.message,
    })
  }

  return searchResults.users
}
