// @flow

import {
  GraphQLObjectType,
  GraphQLSchema
} from 'graphql'
import userQueries from '../models/user/queries'
import userMutations from '../models/user/mutations'
import {Router as expressRouter} from 'express'
import graphqlHTTP from 'express-graphql'

const router = expressRouter()

// Setup GraphQL RootQuery
const RootQuery = new GraphQLObjectType({
  'name':        'Query',
  'description': 'Realize Root Query',
  'fields':      () => ({
    'user':           userQueries.user,
    'users':          userQueries.users,
    'userId':         userQueries.userId,
    'userByUsername': userQueries.userByUsername,
    'userByEmail':    userQueries.userByEmail
  })
})

// Setup GraphQL RootMutation
const RootMutation = new GraphQLObjectType({
  'name':        'Mutation',
  'description': 'Realize Root Mutations',
  'fields':      () => ({
    'addUser':    userMutations.addUser,
    'updateUser': userMutations.updateUser
  })
})

// Set up GraphQL Schema with our RootQuery and RootMutation
const schema = new GraphQLSchema({
  'query':    RootQuery,
  'mutation': RootMutation
})

router.use('/', graphqlHTTP({
  schema,
  'graphiql': true
}))

module.exports = router
