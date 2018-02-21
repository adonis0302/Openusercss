import gql from 'graphql-tag'

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

export const themePropList = `
  _id
  title
  description
  content
  createdAt
  lastUpdate
  version
  screenshots
  user {
    ${userPropList}
  }
  options {
    type
    label
    name
    value
  }
`

export const verifyToken = gql(`
  query($token: String!) {
    verifyToken(token: $token) {
      user {
        ${userPropList}
      }
      token
      ip
      ua
    }
  }`)

export const theme = gql(`
  query($id: ID!) {
    theme(id: $id) {
      ${themePropList}
    }
  }
`)

export const themes = gql(`
  query($query: ThemeQuery!) {
    themes(query: $query) {
      ${themePropList}
    }
  }
`)

export const user = gql(`
  query($id: ID!) {
    user(id: $id) {
      ${userPropList}
    }
  }
`)

export const latestThemes = gql(`
  query($limit: Int!) {
    latestThemes(limit: $limit) {
      ${themePropList}
    }
  }
`)

export const popularThemes = gql(`
  query($limit: Int!) {
    popularThemes(limit: $limit) {
      ${themePropList}
    }
  }
`)

export const search = gql(`
  query(
    $terms: String!
    $limit: Int
    $skip:  Int
  ) {
    search(terms: $terms, limit: $limit, skip: $skip) {
      users {
        ${userPropList}
      },
      themes {
        ${themePropList}
      }
    }
  }
`)
