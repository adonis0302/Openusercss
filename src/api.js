// @flow
import 'babel-polyfill'

import express from 'express'
import log from 'chalk-console'
import morgan from 'morgan'
import corser from 'corser'

import staticConfig from './shared/config'
import setupRoutes from './api/routes'
import {auto,} from './shared/error-handler'

import http from 'http'
import https from 'https'
import helmet from 'helmet'
import raven from 'raven'

const cspOptions = {
  'directives': {
    'defaultSrc': [
      "'self'",
    ],
  },
}

if (process.env.NODE_ENV === 'development') {
  cspOptions.directives.defaultSrc.push('localhost')
  cspOptions.directives.scriptSrc = [
    ...cspOptions.directives.defaultSrc,
    "'unsafe-inline'",
    'unpkg.com',
    'cdn.jsdelivr.net',
  ]
  cspOptions.directives.styleSrc = [
    ...cspOptions.directives.defaultSrc,
    "'unsafe-inline'",
    'unpkg.com',
  ]
}

const servers = []
const init = async () => {
  await auto()
  const app = express()

  if (process.env.NODE_ENV !== 'development') {
    raven.config('https://1d4b75dc379946cbb9e0dd770cb3f099@sentry.io/264732').install()
    app.use(raven.requestHandler())
  }

  app.use(helmet({
    'contentSecurityPolicy': cspOptions,
    'dnsPrefetchControl':    {
      'allow': false,
    },
    'frameguard': {
      'action': 'deny',
    },
    'hsts': {
      'maxAge': 60 * 60 * 24 * 60,
    },
    'referrerPolicy': {
      'policy': 'no-referrer',
    },
  }))

  const config = await staticConfig()

  app.enable('trust proxy')
  app.set('trust proxy', true)

  app.set('env', config.get('env'))
  app.use(corser.create())
  app.use(await setupRoutes())

  log.info(`API environment: ${app.get('env')}`)

  if (process.env.NODE_ENV === 'development') {
    const httpServer = http.createServer(app)

    httpServer.listen(config.get('ports.api.http'))
    servers.push(httpServer)
  }

  // Here, we re-run the above if statement,
  // because the minifier will remove everything in that in a prod build.
  if (process.env.NODE_ENV !== 'development') {
    app.use(morgan('combined'))
    app.use(raven.errorHandler())
  }

  const httpsServer = https.createServer({
    'key':  config.get('keypair.clientprivate'),
    'cert': config.get('keypair.clientcert'),
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
  log.error(`Unhandled promise rejection in API: ${error.message}`)
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
