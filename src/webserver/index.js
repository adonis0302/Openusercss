// @flow
import 'babel-polyfill'

import express from 'express'
import log from 'chalk-console'
import morgan from 'morgan'
import {Nuxt, Builder} from 'nuxt'

import staticConfig from '../shared/config'
import nuxtConfig from './nuxt.config'
import attachHandler from '../shared/error-handler'

import http from 'http'
import https from 'https'

const servers = []

const init = async () => {
  await attachHandler()

  const app = express()
  const config = await staticConfig()
  const nuxt = new Nuxt(nuxtConfig)

  app.set('env', config.get('env'))
  app.use(morgan('combined'))
  app.use(nuxt.render)

  log.info(`Webserver environment: ${app.get('env')}`)

  if (config.get('env') === 'development') {
    const httpServer = http.createServer(app)

    await new Builder(nuxt).build()
    httpServer.listen(config.get('ports.frontend.http'))
    servers.push(httpServer)
  }

  const httpsServer = https.createServer({
    'key':  config.get('keypair.clientprivate'),
    'cert': config.get('keypair.clientcert')
  }, app)

  httpsServer.listen(config.get('ports.frontend.https'))
  servers.push(httpsServer)

  log.info(`Webserver started: ${JSON.stringify(config.get('ports.frontend'))}`)

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
  log.info('Webserver received SIGTERM')
  servers.forEach((server) => {
    server.close()
  })
  process.exit()
})

process.on('exit', () => {
  log.info('Webserver process exiting immediately')
})
