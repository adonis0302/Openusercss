const outputTypeDefs = `
  type User {
    _id:            ID!
    username:       String!
    displayname:    String!
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
    type:  String!
    label: String!
    name:  String!
    value: String!
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
    version:     String!
    screenshots: [String]
    options:     [Option]
  }

  type SearchResults {
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

const inputTypeDefs = `
  input ThemeQuery {
    id:   ID
    user: String
  }
`

const rootTypeDefs = `
  type Query {
    viewer: User
    verifyToken: Session!
    version: Version!

    theme(
      id: ID!
    ): Theme!

    themes(
      query: ThemeQuery!
    ): [Theme]!

    user(
      id: ID!
    ): User!

    search(
      terms: String!
      limit: Int
      skip:  Int
    ): SearchResults!

    latestThemes(
      limit: Int
    ): [Theme]!

    popularThemes(
      limit: Int
    ): [Theme]!
  }

  type Mutation {
    viewer: User
    logout: Boolean!
    resendVerification: Boolean!

    verifyEmail(
      token: String!
    ): Boolean!

    register(
      displayname: String!
      email:       String!
      password:    String!
    ): User!

    login(
      email:    String!
      password: String!
    ): Session!

    deleteTheme(
      id: ID!
    ): Boolean!

    theme(
      id:          ID
      title:       String!
      description: String!
      content:     String!
      version:     String!
      screenshots: [String]
      options:     String!
    ): Theme!

    account(
      password:    String
      displayname: String
      email:       String
      bio:         String
      donationUrl: String
    ): User!

    rate(
      id:    String!
      value: Int!
    ): Theme!
  }
`

export default `
  ${outputTypeDefs}
  ${inputTypeDefs}
  ${rootTypeDefs}
`
