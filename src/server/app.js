// @flow
import 'babel-polyfill'

import express from 'express'
import path from 'path'
import log from 'chalk-console'
// import bodyParser from 'body-parser'
// import morgan from 'morgan'

import staticConfig from './config'
import setupRoutes from './routes'
import attachHandler from './shared/error-handler'

const init = async () => {
  const app = express()
  const config = await staticConfig()

  await attachHandler()

  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'pug')
  app.set('port', config.get('port'))

  app.use(express.static(path.join(__dirname, 'client')))
  app.use(await setupRoutes())

  log.info(`App environment: ${app.get('env')}`)

  app.listen(app.get('port'), () => {
    log.info(`App started on port ${app.get('port')}`)
  })
  // app.use(morgan('combined'))
  /* app.use(bodyParser.urlencoded({
    'extended': false
  })) */
  return true
}

init()
