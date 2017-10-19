// @flow

const typeDefs = `
  type User {
    _id:         ID!
    username:    String!
    displayname: String!
    themes:      [Theme]!
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
  }

  type Query {
    verifyToken(token: String!): Session!
    theme(id: ID!): Theme!
    user(id: ID!): User!
    search(terms: String!, count: Int, offset: Int): [Theme]!
    latestThemes(count: Int): [Theme]!
  }

  type Mutation {
    register(displayname: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): Session!
    logout(token: String!): Boolean!
    createTheme(token: String!, title: String!, description: String!, content: String!, scope: String!): Theme!
  }
`

export default typeDefs
