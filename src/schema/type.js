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

  type Query {
    verifyToken(token: String!): Boolean!
    test: Boolean!
  }

  type LoginPayload {
    user: User!
    auth: UserLogin!
  }

  type Mutation {
    register(displayname: String!, email: String!, password: String!): User
    login(email: String!, password: String!): LoginPayload
    logout(token: String!): Boolean
  }
`

export default typeDefs
