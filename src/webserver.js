// @flow
import 'babel-polyfill'

import {createBundleRenderer} from 'vue-server-renderer'

import express from 'express'
import log from 'chalk-console'
import morgan from 'morgan'
import path from 'path'
import http from 'http'
import https from 'https'
import pify from 'pify'
import fs from 'fs'
import pug from 'pug'

import staticConfig from './shared/config'

const servers = []
const basePath = path.resolve(process.mainModule.paths[0], '..')
const clientPath = path.join(basePath, '/static/server.js')
const templatePath = path.join(basePath, '/views/index.template.pug')

const init = async () => {
  const app = express()
  const config = await staticConfig()
  const clientBuffer = await pify(fs.readFile)(clientPath)
  const client = clientBuffer.toString()
  const renderer = createBundleRenderer(client)

  app.set('env', config.get('env'))
  app.use(express.static(path.join(basePath, 'static')))

  if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'))
  }

  app.get('*', async (req, res) => {
    let appHTML = ''
    const appStream = await renderer.renderToStream({
      'url': req.url
    })

    appStream.on('data', (data) => {
      appHTML = `${appHTML}${data.toString()}`
    })

    appStream.on('end', () => {
      res.write(pug.renderFile(templatePath, {
        req,
        appHTML
      }))

      res.end()
    })
  })

  log.info(`Webserver environment: ${app.get('env')}`)

  if (config.get('env') === 'development') {
    const httpServer = http.createServer(app)

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
})

process.on('SIGINT', () => {
  log.info('Webserver received SIGINT')
  servers.forEach((server) => {
    server.close()
  })
})

process.on('exit', () => {
  log.info('Webserver process exiting immediately')
})
