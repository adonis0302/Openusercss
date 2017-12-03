// @flow

const typeDefs = `
  type User {
    _id:            ID!
    username:       String!
    displayname:    String!
    themes:         [Theme]!
    avatarUrl:      String!
    smallAvatarUrl: String!
    lastSeen:       String!
    lastSeenReason: String!
  }

  type Session {
    _id: ID!
    user: User!
    token: String!
    expiresAt: String!
    createdAt: String!
  }

  type Theme {
    _id: ID!
    user: User!
    title: String!
    description: String!
    content: String!
    createdAt: String!
    lastUpdate: String!
    rating: Float!
    scope: String!
    version: String!
  }

  type Query {
    verifyToken(token: String!): Session!
    theme(id: ID!): Theme!
    user(id: ID!): User!
    search(terms: String!, count: Int, offset: Int): [Theme]!
    latestThemes(limit: Int): [Theme]!
  }

  type Mutation {
    register(displayname: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): Session!
    logout(token: String!): Boolean!
    theme(token: String!, id: ID, title: String!, description: String!, content: String!, scope: String!, version: String!): Theme!
  }
`

export default typeDefs
