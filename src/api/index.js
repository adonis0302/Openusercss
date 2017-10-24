// @flow
import 'babel-polyfill'

import express from 'express'
import log from 'chalk-console'
import morgan from 'morgan'

import staticConfig, {inProd} from '../shared/config'
import setupRoutes from './routes'
import attachHandler from './shared/error-handler'

import http from 'http'
import https from 'https'

const init = async () => {
  await attachHandler()

  const app = express()
  const config = await staticConfig()

  app.set('env', config.get('env'))
  app.use(await setupRoutes())
  app.use(morgan('combined'))

  log.info(`API environment: ${app.get('env')}`)

  if (!inProd()) {
    http.createServer(app).listen(config.get('ports.api.http'))
  }

  https.createServer({
    'key':  config.get('keypair.clientprivate'),
    'cert': config.get('keypair.clientcert')
  }, app).listen(config.get('ports.api.https'))

  log.info(`API started: ${JSON.stringify(config.get('ports.api'))}`)

  return true
}

(async () => {
  try {
    init()
  } catch (error) {
    log.error(error)
  }
})()
