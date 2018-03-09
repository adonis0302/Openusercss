import 'babel-polyfill'

import express from 'express'
import log from 'chalk-console'
import morgan from 'morgan'

import staticConfig from '../lib/config'

import http from 'http'
import raven from 'raven'

import secure from './modules/secure'
import routes from './modules/routes'

let server = null
const init = async () => {
  const app = express()
  const config = await staticConfig()

  if (config.get('env') !== 'development') {
    raven.config(config.get('sentry.api')).install()
    app.use(raven.requestHandler())
  }

  app.enable('trust proxy')
  app.set('trust proxy', true)
  app.set('env', config.get('env'))

  await secure({app, config,})
  await routes({app, config,})

  server = http.createServer(app)

  server.listen(config.get('ports.api.http'))
  log.info(`API started (http): ${JSON.stringify(config.get('ports.api.http'))}`)
  log.info(`API environment: ${app.get('env')}`)

  if (config.get('env') !== 'development') {
    app.use(morgan('combined'))
    app.use(raven.errorHandler())
  }

  return {
    app,
    server,
  }
}

(async () => {
  try {
    await init()
  } catch (error) {
    raven.captureException(error)
    log.error(error.stack)
  }
})()

process.on('unhandledRejection', (error) => {
  log.error(`Unhandled promise rejection in API: ${error.message}`)
  log.error(error.stack)
  process.exit(1)
})

process.on('SIGTERM', () => {
  log.info('API received SIGTERM')
  server.close()
  process.exit(15)
})

process.on('SIGINT', () => {
  log.info('API received SIGINT')
  server.close()
  process.exit(2)
})

process.on('exit', () => {
  log.info('API process exiting immediately')
})
