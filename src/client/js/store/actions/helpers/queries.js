import gql from 'graphql-tag'

export const themePropList = `
  _id
  title
  description
  content
  createdAt
  lastUpdate
  version
  screenshots
  user
  options {
    type
    label
    name
    value
  }
`

export const userPropList = `
  _id
  displayname
  username
  avatarUrl
  smallAvatarUrl
  lastSeen
  lastSeenReason
  bio
  donationUrl
`

export const verifyToken = ({token,}) => gql(`{
  verifyToken(token: "${token}") {
    user {
      ${userPropList}
    }
    token
    ip
    ua
  }
}`)

export const theme = ({id,}) => gql(`
  query {
    theme(id: "${id}") {
      ${themePropList}
    }
  }
`)

export const user = ({id,}) => gql(`
  query {
    user(id: "${id}") {
      ${userPropList}
    }
  }
`)

export const latestThemes = ({limit,}) => gql(`
  query {
    latestThemes(limit: ${limit}) {
      ${themePropList}
    }
  }
`)

export const popularThemes = ({limit,}) => gql(`
  query {
    popularThemes(limit: ${limit}) {
      ${themePropList}
    }
  }
`)

export const search = ({terms, limit, skip,}) => gql(`
  query {
    search(terms: "${terms}", limit: ${limit}, skip: ${skip}) {
      users {
        ${userPropList}
      },
      themes {
        ${themePropList}
      }
    }
  }
`)
