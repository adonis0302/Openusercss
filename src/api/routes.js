// @flow

import express from 'express'
import {graphqlExpress, graphiqlExpress} from 'apollo-server-express'
import bodyParser from 'body-parser'
import staticConfig from '../shared/config'

import schema from './backend'
import connectMongo from './connector'
import brute from './brute'

const expressRouter = express.Router
const setupRoutes = async () => {
  const config = await staticConfig()
  const router = expressRouter()
  const context = await connectMongo()

  if (config.get('env') === 'development') {
    router.use('/graphiql', graphiqlExpress({
      'endpointURL': '/'
    }))
  }

  router.use('/', brute.prevent, bodyParser.json(), graphqlExpress({
    context,
    schema
  }))

  return router
}

export default setupRoutes
