import express from 'express'
import log from 'chalk-console'
import morgan from 'morgan'
import http from 'http'
import raven from 'raven'

import staticConfig from 'lib/config'

import {handler as clientHandler,} from './client'
import {handler as apiHandler,} from './api'

const createApp = ({config,}) => {
  const app = express()

  if (config.get('env') === 'production') {
    raven.config(config.get('sentry.client')).install()
    app.use(raven.requestHandler())
    app.use(raven.errorHandler())
    app.use(morgan('combined'))
  }

  app.enable('trust proxy')
  app.set('trust proxy', true)
  app.set('env', config.get('env'))

  return app
}

let clientServer = null

export const clientInit = async () => {
  const config = await staticConfig()
  const app = createApp({config,})

  log.info(`CLIENT environment: ${app.get('env')}`)

  await clientHandler({
    app,
    config,
    'mode': 'client',
  })

  clientServer = http.createServer(app)

  clientServer.listen(config.get('ports.frontend.http'))
  log.info(`CLIENT started (http): ${JSON.stringify(config.get('ports.frontend.http'))}`)
}

let apiServer = null

export const apiInit = async () => {
  const config = await staticConfig()
  const app = createApp({config,})

  log.info(`API environment: ${app.get('env')}`)

  await apiHandler({
    app,
    config,
    'mode': 'api',
  })

  apiServer = http.createServer(app)

  apiServer.listen(config.get('ports.api.http'))
  log.info(`API started (http): ${JSON.stringify(config.get('ports.api.http'))}`)
}

export {apiServer, clientServer,}
