// @flow
import express from 'express'
import {graphqlExpress, graphiqlExpress} from 'apollo-server-express'
import bodyParser from 'body-parser'
import staticConfig from '../shared/config'

import themeCdnHandler from './theme-cdn-handler'
import schema from './backend'
import connectMongo from './connector'
import migrate from './migrate'

const expressRouter = express.Router
const setupRoutes = async () => {
  const config = await staticConfig()
  const router = expressRouter()
  const db = await connectMongo()
  const migrationResult = await migrate(db)

  if (!migrationResult) {
    throw new Error('Migration failed, refusing start')
  }

  if (config.get('env') === 'development') {
    router.use('/graphiql', graphiqlExpress({
      'endpointURL': '/'
    }))
  }

  router.use('/theme/:id.user.css', themeCdnHandler)

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
