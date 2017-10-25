// @flow
import 'babel-polyfill'

import express from 'express'
import log from 'chalk-console'
import morgan from 'morgan'

import staticConfig from '../shared/config'
import setupRoutes from './routes'
import attachHandler from '../shared/error-handler'

import http from 'http'
import https from 'https'

const servers = []

const init = async () => {
  await attachHandler()

  const app = express()
  const config = await staticConfig()

  app.set('env', config.get('env'))
  app.use(await setupRoutes())
  app.use(morgan('combined'))

  log.info(`API environment: ${app.get('env')}`)

  if (config.get('env') === 'development') {
    const httpServer = http.createServer(app)

    httpServer.listen(config.get('ports.api.http'))
    servers.push(httpServer)
  }

  const httpsServer = https.createServer({
    'key':  config.get('keypair.clientprivate'),
    'cert': config.get('keypair.clientcert')
  }, app)

  httpsServer.listen(config.get('ports.api.https'))
  servers.push(httpsServer)

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

process.on('SIGTERM', () => {
  log.info('API received SIGTERM')
  servers.forEach((server) => {
    server.close()
  })
  process.exit()
})

process.on('exit', () => {
  log.info('API process exiting immediately')
})
