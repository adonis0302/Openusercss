// @flow

const typeDefs = `
  type User {
    _id:         ID!
    username:    String!
    displayname: String!
    email:       String!
  }

  type UserLogin {
    token: String!
    userId: String!
  }

  type LoginPayload {
    user: User!
    auth: UserLogin!
  }

  type Theme {
    author: User!
    title: String!
    description: String!
    content: String!
    rating: Float
  }

  type Query {
    verifyToken(token: String!): Boolean!
    test: Boolean!
    getTheme: Theme
  }

  type Mutation {
    register(displayname: String!, email: String!, password: String!): User
    login(email: String!, password: String!): LoginPayload
    logout(token: String!): Boolean
    createTheme(token: String!, title: String!, description: String!, content: String!): Theme
  }
`

export default typeDefs
