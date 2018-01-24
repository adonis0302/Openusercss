const outputTypeDefs = `
  type User {
    _id:            ID!
    username:       String!
    displayname:    String!
    themes:         [String]!
    avatarUrl:      String!
    smallAvatarUrl: String!
    lastSeen:       String!
    lastSeenReason: String!
    createdAt:      String!
    lastUpdate:     String!
    bio:            String!
    donationUrl:    String!
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
    label: String!
    name: String!
    value: String!
    possibleValues: String @deprecated
  }

  type Rating {
    _id:   ID!
    user:  User!
    theme: Theme!
    value: Int!
  }

  type Theme {
    _id:         ID!
    user:        User!
    title:       String!
    description: String!
    content:     String!
    createdAt:   String!
    lastUpdate:  String!
    user:        String!
    version:     String!
    screenshots: [String]
    options:     [Option]
  }

  type Results {
    users:  [User]
    themes: [Theme]
  }

  type Version {
    revisionLong:   String!
    revisionShort:  String!
    revisionTag:    String!
    revisionBranch: String!
  }
`

const rootTypeDefs = `
  type Query {
    verifyToken(token: String!): Session!
    theme(id: ID!): Theme!
    themes(query: String!): [Theme]!
    user(id: ID!): User!
    search(terms: String!, limit: Int, skip: Int): Results!
    latestThemes(limit: Int): [Theme]!
    version: Version!
    popularThemes(limit: Int): [Theme]!
  }

  type Mutation {
    verifyEmail(
      token: String!
    ): Boolean!

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
      token:       String!
      id:          ID
      title:       String!
      description: String!
      content:     String!
      version:     String!
      screenshots: [String]
      options:     String!
    ): Theme!

    account(
      token:       String!
      password:    String
      displayname: String
      email:       String
      bio:         String
      donationUrl: String
    ): User!

    rate(
      id:    String!
      token: String!
      value: Int!
    ): Theme!
  }
`

export default `
  ${outputTypeDefs}
  ${rootTypeDefs}
`
