// @flow
import 'babel-polyfill'

import express from 'express'
import path from 'path'
import log from 'chalk-console'
import morgan from 'morgan'

import staticConfig from './config'
import setupRoutes from './routes'
import attachHandler from './shared/error-handler'

import http from 'http'
import https from 'https'

const init = async () => {
  await attachHandler()

  const app = express()
  const config = await staticConfig()

  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'pug')
  app.set('port', config.get('ports.http'))

  app.use(express.static(path.join(__dirname, 'client')))
  app.use('/worker.js', express.static(path.join(__dirname, 'client/js/worker.js')))

  app.use(await setupRoutes())
  app.use(morgan('combined'))

  log.info(`App environment: ${app.get('env')}`)

  http.createServer(app).listen(config.get('ports.http'))
  https.createServer({
    'key':  config.get('keypair.clientprivate'),
    'cert': config.get('keypair.clientcert')
  }, app).listen(config.get('ports.https'))

  log.info(`App started: ${JSON.stringify(config.get('ports'))}`)

  return true
}

(async () => {
  try {
    init()
  } catch (error) {
    log.error(error)
  }
})()
