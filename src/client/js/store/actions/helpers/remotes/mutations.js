import gql from 'graphql-tag'
import {cloneDeep} from 'lodash'
import {userPropList, themePropList} from '../queries'
import {apolloClient} from '../../'
import {expected} from '../../../../../../shared/custom-errors'

const {AuthenticationError} = expected

export const remoteLogin = async ({email, password}) => {
  const mutation = gql(`
    mutation {
      login(email: "${email}", password: "${password}") {
        token,
        ip,
        ua,
        user {
          themes {
            ${themePropList}
          },
          ${userPropList}
        }
      }
    }
  `)
  let session = null

  try {
    session = await apolloClient.mutate({
      mutation
    })
  } catch (error) {
    throw new AuthenticationError(error.message)
  }

  return session
}

export const remoteLogout = async (token) => {
  const mutation = gql(`
    mutation {
      logout(token: "${token}")
    }
  `)

  try {
    const result = await apolloClient.mutate({
      mutation
    })

    if (!result.data.logout) {
      throw new AuthenticationError('Failed to shred session')
    }
  } catch (error) {
    throw new AuthenticationError(error.message)
  }

  return true
}

export const remoteRegister = async ({email, password, displayname}) => {
  const mutation = gql(`
    mutation {
      register(displayname: "${displayname}", email: "${email}", password: "${password}") {
        username
      }
    }
  `)
  const result = await apolloClient.mutate({
    mutation
  })

  return result
}

export const remoteSaveTheme = async (theme, token) => {
  if (!theme || !theme.content) {
    throw new Error('No content')
  }

  const preparedTheme = cloneDeep(theme)

  preparedTheme.content = encodeURIComponent(preparedTheme.content)
  let mutation = null
  const newMutation = gql(`
    mutation {
      theme(title: "${preparedTheme.title}", description: "${preparedTheme.description}", content: "${preparedTheme.content}", version: "${preparedTheme.version}", token: "${token}") {
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
      theme(id: "${preparedTheme._id}", title: "${preparedTheme.title}", description: "${preparedTheme.description}", content: "${preparedTheme.content}", version: "${preparedTheme.version}", token: "${token}") {
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
    throw new AuthenticationError(error.message)
  }

  return savedTheme
}

export const deleteTheme = async (id, token) => {
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
    throw new AuthenticationError(error.message)
  }

  return success
}
