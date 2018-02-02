// @flow
import 'babel-polyfill'

import {createBundleRenderer,} from 'vue-server-renderer'

import express from 'express'
import log from 'chalk-console'
import morgan from 'morgan'
import path from 'path'
import http from 'http'
import https from 'https'
import pify from 'pify'
import fs from 'fs'
import pug from 'pug'
import helmet from 'helmet'
import schemas from 'posthtml-schemas'
import raven from 'raven'
import {auto,} from './shared/error-handler'

import staticConfig from './shared/config'

const servers = []
const basePath = path.resolve(process.mainModule.paths[0], '..')
const clientPath = path.join(basePath, '/static/server.js')
const templatePath = path.join(basePath, '/views/index.template.pug')

const cspOptions = {
  'directives': {
    'defaultSrc': [
      "'self'",
      'openusercss.org',
      'openusercss.com',
    ],
    'scriptSrc': [
      "'self'",
      'openusercss.org',
      'openusercss.com',
      'sentry.io',
    ],
    'styleSrc': [
      "'self'",
      "'unsafe-inline'",
      'openusercss.org',
      'openusercss.com',
    ],
    'imgSrc': [
      "'self'",
      'data:',
      'imageproxy.openusercss.org',
      'imageproxy.openusercss.com',
      'gravatar.com',
    ],
    'connectSrc': [
      'openusercss.org',
      'openusercss.com',
      'api.openusercss.org',
      'api.openusercss.com',
      'imageproxy.openusercss.org',
      'imageproxy.openusercss.com',
      'gravatar.com',
      'sentry.io',
    ],
    'fontSrc': [
      'data:',
    ],
    'workerSrc': [
      "'self'",
    ],
  },
}

const init = async () => {
  await auto()
  const app = express()
  const config = await staticConfig()

  if (config.get('env') === 'development') {
    cspOptions.directives.defaultSrc.push('localhost')
    cspOptions.directives.imgSrc.push('localhost')
    cspOptions.directives.connectSrc.push('localhost:*')
    cspOptions.directives.connectSrc.push('ws://localhost:*')
    cspOptions.directives.scriptSrc = [
      ...cspOptions.directives.scriptSrc,
      "'unsafe-inline'",
      "'unsafe-eval'",
    ]
  }

  if (config.get('env') !== 'development') {
    raven.config(config.get('sentry.webserver')).install()
    app.use(raven.requestHandler())
  }

  app.use(helmet({
    'contentSecurityPolicy': cspOptions,
    'dnsPrefetchControl':    {
      'allow': true,
    },
    'frameguard': {
      'action': 'deny',
    },
    'hsts': {
      'maxAge': 60 * 60 * 24 * 60,
    },
    'referrerPolicy': {
      'policy': 'strict-origin-when-cross-origin',
    },
  }))

  app.enable('trust proxy')
  app.set('trust proxy', true)

  const clientBuffer = await pify(fs.readFile)(clientPath)
  const client = clientBuffer.toString()
  const renderer = createBundleRenderer(client)

  app.set('env', config.get('env'))
  if (process.env.NODE_ENV !== 'development') {
    app.use(morgan('combined'))
  }

  app.get(/.*\.(js|json|png|jpg|txt|css|mp4|map)$/, express.static(path.join(basePath, 'static'), {
    'dotfiles': 'deny',
  }))

  app.get(/^(?!.*\.(js|json|png|jpg|txt|css|mp4|map)$)/, async (req, res) => {
    let appHTML = ''
    const appStream = await renderer.renderToStream({
      'url': req.url,
    })

    appStream.on('data', (data) => {
      appHTML = `${appHTML}${data.toString()}`
    })

    appStream.on('end', async () => {
      res.type('html')
      const pugHTML = pug.renderFile(templatePath, {
        req,
        appHTML,
      })
      const {
        html,
      } = await schemas.process(pugHTML)

      res.write(html)
      res.end()
    })

    appStream.on('error', async (err) => {
      log.error('Failed to render client, sending shell HTML:')
      log.error(err.stack)
      res.status(err.code || 500)

      res.type('html')
      const pugHTML = pug.renderFile(templatePath, {
        req,
        appHTML,
      })
      const {
        html,
      } = await schemas.process(pugHTML)

      res.write(html)
      res.end()
    })
  })

  if (process.env.NODE_ENV !== 'development') {
    app.use(raven.errorHandler())
  }

  log.info(`Webserver environment: ${app.get('env')}`)

  if (config.get('env') === 'development') {
    const httpServer = http.createServer(app)

    httpServer.listen(config.get('ports.frontend.http'))
    log.info(`Webserver started (http): ${config.get('ports.frontend.http')}`)
    servers.push(httpServer)
  }

  const httpsServer = https.createServer({
    'key':  config.get('keypair.clientprivate'),
    'cert': config.get('keypair.clientcert'),
  }, app)

  httpsServer.listen(config.get('ports.frontend.https'))
  log.info(`Webserver started (https): ${config.get('ports.frontend.https')}`)
  servers.push(httpsServer)

  return true
}

(async () => {
  try {
    await init()
  } catch (err) {
    log.error(err)
  }
})()

process.on('unhandledRejection', (error) => {
  log.error(`Unhandled promise rejection in webserver: ${error.message}`)
  log.error(error.stack)
  process.exit(1)
})

process.on('SIGTERM', () => {
  log.info('Webserver received SIGTERM')
  servers.forEach((server) => {
    server.close()
  })
  process.exit(15)
})

process.on('SIGINT', () => {
  log.info('Webserver received SIGINT')
  servers.forEach((server) => {
    server.close()
  })
  process.exit(2)
})

process.on('exit', () => {
  log.info('Webserver process exiting immediately')
})
