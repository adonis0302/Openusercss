// @flow
import 'babel-polyfill'

import express from 'express'
import log from 'chalk-console'
import morgan from 'morgan'

import staticConfig from './shared/config'
import setupRoutes from './api/routes'
import {auto} from './shared/error-handler'

import http from 'http'
import https from 'https'

const servers = []

const init = async () => {
  await auto()

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

process.on('unhandledRejection', (error) => {
  log.error(`Unhandled promise rejection in webserver: ${error.message}`)
  log.error(error.stack)
  process.exit(1)
})

process.on('SIGTERM', () => {
  log.info('API received SIGTERM')
  servers.forEach((server) => {
    server.close()
  })
})

process.on('SIGINT', () => {
  log.info('API received SIGINT')
  servers.forEach((server) => {
    server.close()
  })
})

process.on('exit', () => {
  log.info('API process exiting immediately')
})
