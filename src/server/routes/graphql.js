// @flow

/* import {
  GraphQLObjectType,
  GraphQLSchema
} from 'graphql' */
// import userQueries from '../models/user/queries'
// import userMutations from '../models/user/mutations'
import {Router as expressRouter} from 'express'
// import graphqlHTTP from 'express-graphql'
import {graphqlExpress, graphiqlExpress} from 'apollo-server-express'
import bodyParser from 'body-parser'

import schema from '../schema'
import connectMongo from '../connector'

export default async () => {
  const router = expressRouter()
  const context = await connectMongo()

  router.use('/graphql', bodyParser.json(), graphqlExpress({
    context,
    schema
  }))
  router.use('/graphiql', graphiqlExpress({
    'endpointURL': '/graphql'
  }))

  return router
}
