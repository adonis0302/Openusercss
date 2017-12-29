// @flow
import express from 'express'
import {graphqlExpress, graphiqlExpress} from 'apollo-server-express'
import bodyParser from 'body-parser'

import usercsssRenderer from './usercss-renderer'
import schema from './backend'
import connectMongo from './connector'

const expressRouter = express.Router
const setupRoutes = async () => {
  const router = expressRouter()
  const db = await connectMongo()

  router.use('/graphiql', graphiqlExpress({
    'endpointURL': '/'
  }))

  router.use('/theme/:id.user.css', usercsssRenderer)

  router.use('/', bodyParser.json(), graphqlExpress((req, res, next) => ({
    'context': {
      ...req,
      ...db
    },
    schema
  })))

  return router
}

export default setupRoutes
