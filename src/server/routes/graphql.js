// @flow

import {Router as expressRouter} from 'express'
import {graphqlExpress, graphiqlExpress} from 'apollo-server-express'
import bodyParser from 'body-parser'

import schema from '../backend'
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
