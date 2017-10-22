// @flow

import express from 'express'
import graphqlRoute from './graphql'

const expressRouter = express.Router
const setupRoutes = async () => {
  const router = expressRouter()

  router.use('/', await graphqlRoute())

  router.get('*', (req, res) => {
    res.render('index')
  })

  return router
}

export default setupRoutes
