// @flow

const typeDefs = `
  type User {
    _id:         ID!
    username:    String!
    displayname: String!
    email:       String
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
  }

  type Query {
    verifyToken(token: String!): Session!
    test: Boolean!
    getTheme: Theme!
  }

  type Mutation {
    register(displayname: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): Session!
    logout(token: String!): Boolean!
    createTheme(token: String!, title: String!, description: String!, content: String!): Theme!
  }
`

export default typeDefs
