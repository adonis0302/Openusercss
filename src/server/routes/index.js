// @flow

import express from 'express'
// import log from 'chalk-console'
// import jwt from 'express-jwt'
// import hat from 'hat'
import path from 'path'

import graphqlRoute from './graphql'

const expressRouter = express.Router
const setupRoutes = async () => {
  const router = expressRouter()

  router.use('/', await graphqlRoute())

  router.use(express.static(path.join(__dirname, 'public')))
  router.get('*', (req, res) => {
    res.render('index')
  })

  return router
}

export default setupRoutes
