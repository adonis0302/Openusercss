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
    createdAt:      String!
    lastUpdate:     String!
  }

  type Session {
    _id:       ID!
    user:      User!
    token:     String!
    expiresAt: String!
    createdAt: String!
    ip:        String!
    ua:        String!
  }

  type Option {
    type: String!
    title: String!
    varname: String!
    default: String!
    possibleValues: String
  }

  input OptionInput {
    type: String!
    title: String!
    varname: String!
    default: String!
    possibleValues: [String]
  }

  type Theme {
    _id:         ID!
    user:        User!
    title:       String!
    description: String!
    content:     String!
    createdAt:   String!
    lastUpdate:  String!
    rating:      Float!
    version:     String!
    screenshots: [String]
    options:     [Option]!
  }

  type Results {
    users:  [User]
    themes: [Theme]
  }

  type Query {
    verifyToken(token: String!): Session!
    verifyEmail(token: String!): Boolean!
    theme(id: ID!): Theme!
    user(id: ID!): User!
    search(terms: String!, limit: Int, skip: Int): Results!
    latestThemes(limit: Int): [Theme]!
  }

  type Mutation {
    register(
      displayname: String!
      email: String!
      password: String!
    ): User!
    login(
      email: String!
      password: String!
    ): Session!
    logout(
      token: String!
    ): Boolean!
    deleteTheme(
      token: String!
      id: ID!
    ): Boolean!
    resendVerification(
      token: String!
    ): Boolean!
    theme(
      token: String!
      id: ID
      title: String!
      description: String!
      content: String!
      version: String!
      screenshots: [String]
      options: [OptionInput]!
    ): Theme!
  }
`

export default typeDefs
