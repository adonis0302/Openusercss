import gql from 'graphql-tag'
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
    throw new AuthenticationError(error.message)
  }

  return savedTheme
}
