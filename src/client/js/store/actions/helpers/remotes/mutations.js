import gql from 'graphql-tag'
import {cloneDeep, forOwn,} from 'lodash'
import {userPropList, themePropList,} from '../queries'
import {apolloClient,} from '../../'
import {expected,} from '../../../../../../shared/custom-errors'

const {AuthenticationError,} = expected

export const remoteRate = async ({id, value,}, token) => {
  const mutation = gql(`
    mutation($token: String!, $id: ID!, $value: Int!) {
      rate (
        token: $token
        id: $id
        value: $value
      ) {
        ${themePropList}
      }
    }
  `)

  return apolloClient.mutate({
    mutation,
    'variables': {
      token,
      id,
      value,
    },
  })
}

export const remoteAccount = async (accountData, token) => {
  const mutationHead = `mutation {
    account(`
  const mutationRes = `) {
    ${userPropList}
  }`
  const mutationFoot = '}'
  const mutationData = [
    `token: "${token}"`,
  ]

  forOwn(accountData, (value, key) => {
    if (key === 'bio') {
      mutationData.push(`${key}: "${encodeURIComponent(value)}"`)
    } else {
      mutationData.push(`${key}: "${value}"`)
    }
  })

  const mutationString = [
    mutationHead,
    mutationData.join('\n'),
    mutationRes,
    mutationFoot,
  ].join('\n')

  const mutation = gql(mutationString)
  const result = await apolloClient.mutate({
    mutation,
  })

  return result
}

export const remoteSendVerify = async ({token,}) => {
  const mutation = gql(`
    mutation($token: String!) {
      resendVerification(token: $token)
    }
  `)

  return apolloClient.mutate({
    mutation,
    'variables': {
      token,
    },
  })
}

export const verifyEmail = async (token) => {
  const mutation = gql(`
    mutation($token: String!) {
      verifyEmail(token: $token)
    }
  `)
  let result = null

  try {
    result = await apolloClient.mutate({
      mutation,
      'variables': {
        token,
      },
    })
  } catch (error) {
    result = {
      'data': {
        'verifyEmail': false,
      },
    }
  }

  return result
}

export const remoteLogin = async ({email, password,}) => {
  const mutation = gql(`
    mutation($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token,
        ip,
        ua,
        user {
          ${userPropList}
        }
      }
    }
  `)
  let session = null

  try {
    session = await apolloClient.mutate({
      mutation,
      'variables': {
        email,
        password,
      },
    })
  } catch (error) {
    throw new AuthenticationError(error.message)
  }

  return session
}

export const remoteLogout = async (token) => {
  const mutation = gql(`
    mutation($token: String!) {
      logout(token: $token)
    }
  `)

  try {
    const result = await apolloClient.mutate({
      mutation,
      'variables': {
        token,
      },
    })

    if (!result.data.logout) {
      throw new AuthenticationError('Failed to shred session')
    }
  } catch (error) {
    throw new AuthenticationError(error.message)
  }

  return true
}

export const remoteRegister = async ({email, password, displayname,}) => {
  const mutation = gql(`
    mutation($displayname: String!, $email: String!, $password: String!) {
      register(displayname: $displayname, email: $email, password: $password) {
        ${userPropList}
      }
    }
  `)
  const result = await apolloClient.mutate({
    mutation,
    'variables': {
      displayname,
      email,
      password,
    },
  })

  return result
}

export const remoteSaveTheme = async (theme, token) => {
  if (!theme || !theme.content) {
    throw new Error('No content')
  }
  const preparedTheme = cloneDeep(theme)
  let mutation = null

  preparedTheme.options.forEach((option, index) => {
    Reflect.deleteProperty(option, '__typename')
    preparedTheme.options[index] = option
  })

  preparedTheme.title = encodeURIComponent(preparedTheme.title)
  preparedTheme.content = encodeURIComponent(preparedTheme.content)
  preparedTheme.screenshots = JSON.stringify(preparedTheme.screenshots || [])
  preparedTheme.options = encodeURIComponent(JSON.stringify(preparedTheme.options || []))
  preparedTheme.description = encodeURIComponent(preparedTheme.description)

  const newMutation = gql(`
    mutation(
      $title: String!
      $description: String!
      $content: String!
      $version: String!
      $screenshots: [String]!
      $options: String!
      $token: String!
    ) {
      theme(
        title: $title
        description: $description
        content: $content
        version: $version
        screenshots: $screenshots
        options: $options
        token: $token
      ) {
        ${themePropList}
      }
    }
  `)
  const existingMutation = gql(`
    mutation(
      $title: String!
      $description: String!
      $content: String!
      $version: String!
      $screenshots: [String]!
      $options: String!
      $token: String!
      $id: ID!
    ) {
      theme(
        id: $id,
        title: $title
        description: $description
        content: $content
        version: $version
        screenshots: $screenshots
        options: $options
        token: $token
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

  savedTheme = await apolloClient.mutate({
    mutation,
    'variables': {
      'id':          preparedTheme._id,
      'title':       preparedTheme.title,
      'description': preparedTheme.description,
      'content':     preparedTheme.content,
      'version':     preparedTheme.version,
      'screenshots': preparedTheme.screenshots,
      'options':     preparedTheme.options,
      token,
    },
  })

  return savedTheme
}

export const deleteTheme = async (id, token) => {
  const mutation = gql(`
    mutation($id: ID!, $token: String!) {
      deleteTheme(id: $id, token: $token)
    }
  `)
  let success = null

  try {
    success = await apolloClient.mutate({
      mutation,
      'variables': {
        id,
        token,
      },
    })
  } catch (error) {
    throw new AuthenticationError(error.message)
  }

  return success
}
