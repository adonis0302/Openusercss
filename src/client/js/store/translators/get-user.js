import {cloneDeep,} from 'lodash'
import {apolloClient,} from '../actions'
import {ServerError,} from '../../../../shared/custom-errors'
import {user, search,} from '../actions/helpers/queries'
import {upsert,} from '../db'

export const getUser = async (query) => {
  let userResult = null

  try {
    userResult = await apolloClient.query({
      'query': user(query),
    })
  } catch (error) {
    throw new ServerError(error)
  }

  const doneUser = cloneDeep(userResult.data.user)

  upsert('users', cloneDeep(userResult.data.user))
  return doneUser
}

export const getUsers = async (query) => {
  let searchResults = null

  try {
    searchResults = await apolloClient.query({
      'query': search(query),
    })
  } catch (error) {
    throw new ServerError({
      'message': error.message,
    })
  }

  return searchResults.users
}
