// @flow

import express from 'express'
import {graphqlExpress, graphiqlExpress} from 'apollo-server-express'
import bodyParser from 'body-parser'

import schema from './backend'
import connectMongo from './connector'
import brute from './brute'

const expressRouter = express.Router
const setupRoutes = async () => {
  const router = expressRouter()
  const context = await connectMongo()

  router.use('/graphiql', graphiqlExpress({
    'endpointURL': '/'
  }))
  router.use('/', brute.prevent, bodyParser.json(), graphqlExpress({
    context,
    schema
  }))

  return router
}

export default setupRoutes
