import gql from 'graphql-tag'

export const themePropList = `
  _id,
  title,
  description,
  content,
  createdAt,
  lastUpdate,
  rating,
  version,
  screenshots,
  options {
    type,
    title,
    varname,
    default,
    possibleValues
  }
`

export const userPropList = `
  _id,
  displayname,
  username,
  avatarUrl,
  smallAvatarUrl,
  lastSeen,
  lastSeenReason,
  bio,
  donationUrl
`

export const verifyToken = ({token}) => gql(`{
  verifyToken(token: "${token}") {
    user {
      ${userPropList}
    },
    token,
    ip,
    ua
  }
}`)

export const theme = ({id}) => gql(`
  query {
    theme(id: "${id}") {
      user {
        ${userPropList}
      },
      ${themePropList}
    }
  }
`)

export const user = ({id}) => gql(`
  query {
    user(id: "${id}") {
      themes {
        ${themePropList}
      },
      ${userPropList}
    }
  }
`)

export const latestThemes = ({limit}) => gql(`
  query {
    latestThemes(limit: ${limit}) {
      user {
        ${userPropList}
      },
      ${themePropList}
    }
  }
`)

export const search = ({terms, limit, skip}) => gql(`
  query {
    search(terms: "${terms}", limit: ${limit}, skip: ${skip}) {
      users {
        ${userPropList}
        themes {
          ${themePropList}
        }
      },
      themes {
        ${themePropList}
        user {
          ${userPropList}
        }
      }
    }
  }
`)
