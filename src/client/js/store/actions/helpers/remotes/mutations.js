import gql from 'graphql-tag'
import {cloneDeep, forOwn} from 'lodash'
import {userPropList, themePropList} from '../queries'
import {apolloClient} from '../../'
import {expected} from '../../../../../../shared/custom-errors'

const {AuthenticationError} = expected

export const remoteAccount = async (accountData, token) => {
  const mutationHead = `mutation {
    account(`
  const mutationRes = `) {
    ${userPropList}
  }`
  const mutationFoot = '}'
  const mutationData = [
    `token: "${token}"`
  ]

  forOwn(accountData, (value, key) => {
    if (value) {
      mutationData.push(`${key}: "${value}"`)
    }
  })

  const mutationString = [
    mutationHead,
    mutationData.join('\n'),
    mutationRes,
    mutationFoot
  ].join('\n')

  const mutation = gql(mutationString)
  const result = await apolloClient.mutate({
    mutation
  })

  return result
}

export const remoteSendVerify = async ({token}) => {
  const mutation = gql(`
    mutation {
      resendVerification(token: "${token}")
    }
  `)
  let result = null

  result = await apolloClient.mutate({
    mutation
  })

  return result
}

export const verifyEmail = async (token) => {
  const mutation = gql(`
    mutation {
      verifyEmail(token: "${token}")
    }
  `)
  let result = null

  try {
    result = await apolloClient.mutate({
      mutation
    })
  } catch (error) {
    result = {
      'data': {
        'verifyEmail': false
      }
    }
  }

  return result
}

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
        ${userPropList}
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
  let mutation = null

  preparedTheme.content = encodeURIComponent(preparedTheme.content)
  preparedTheme.screenshots = JSON.stringify(preparedTheme.screenshots || [])
  preparedTheme.options = JSON.stringify(preparedTheme.options || []).replace(/\"([^(\")"]+)\":/g, '$1:')
  const newMutation = gql(`
    mutation {
      theme(
        title: "${preparedTheme.title}",
        description: "${preparedTheme.description}",
        content: "${preparedTheme.content}",
        version: "${preparedTheme.version}",
        screenshots: ${preparedTheme.screenshots},
        options: ${preparedTheme.options},
        token: "${token}"
      ) {
        ${themePropList}
        user {
          ${userPropList}
        }
      }
    }
  `)
  const existingMutation = gql(`
    mutation {
      theme(
        id: "${preparedTheme._id}",
        title: "${preparedTheme.title}",
        description: "${preparedTheme.description}",
        content: "${preparedTheme.content}",
        version: "${preparedTheme.version}",
        screenshots: ${preparedTheme.screenshots},
        options: ${preparedTheme.options},
        token: "${token}"
      ) {
        ${themePropList}
        user {
          ${userPropList}
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
