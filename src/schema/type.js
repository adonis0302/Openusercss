// @flow

const typeDefs = `
  type User {
    _id:         ID!
    username:    String!
    displayname: String!
    password:    String!
    email:       String!
  }

  type UserLogin {
    token: String!
    userId: String!
  }

  type Test {
    id: Int!
    content: String!
  }

  type Query {
    allUsers: [User!]!
    allLogins: [UserLogin!]!
    getEvilSecret(token: String!): String
    test: [Test!]!
  }

  type LoginPayload {
    user: User!
    auth: UserLogin!
  }

  type Mutation {
    register(displayname: String!, email: String!, password: String!): User
    login(email: String!, password: String!): LoginPayload
  }
`

export default typeDefs
