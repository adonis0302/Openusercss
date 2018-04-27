import 'babel-polyfill'

import express from 'express'
import log from 'chalk-console'
import morgan from 'morgan'

import staticConfig from 'lib/config'

import http from 'http'
import raven from 'raven'

import secure from 'lib/express/secure'
import routes from 'lib/express/client-routes'
import signals from 'lib/express/signal-handler'
import cors from 'lib/express/cors'

let server = null
const init = async () => {
  const app = express()
  const config = await staticConfig()

  if (config.get('env') !== 'development') {
    raven.config(config.get('sentry.client')).install()
    app.use(raven.requestHandler())
  }

  app.enable('trust proxy')
  app.set('trust proxy', true)
  app.set('env', config.get('env'))

  app.use(morgan('combined'))

  await secure({app, config,})
  await cors({app, config,})
  await routes({app, config,})

  server = http.createServer(app)

  server.listen(config.get('ports.frontend.http'))
  log.info(`CLIENT started (http): ${JSON.stringify(config.get('ports.frontend.http'))}`)
  log.info(`CLIENT environment: ${app.get('env')}`)

  if (config.get('env') !== 'development') {
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

signals({
  'name':   'CLIENT',
  'thread': process,
  cleanup () {
    return server.close()
  },
})
