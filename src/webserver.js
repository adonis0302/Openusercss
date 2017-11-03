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

import staticConfig from './shared/config'
import attachHandler from './shared/error-handler'

// import appBase from '../../build/webserver/pages/app-base/app-base.vue'
// import client from './client/js'

const servers = []
const basePath = path.resolve(process.mainModule.paths[0], '..')
const clientPath = path.join(basePath, '/webserver/static/server.js')

const init = async () => {
  await attachHandler()

  const app = express()
  const config = await staticConfig()
  const clientBuffer = await pify(fs.readFile)(clientPath)
  const client = clientBuffer.toString()
  const renderer = createBundleRenderer(client)

  app.set('env', config.get('env'))
  app.use(morgan('combined'))
  app.use(express.static(path.join(basePath, 'static')))

  app.get('/', async (req, res) => {
    let appString = ''

    try {
      appString = await renderer.renderToString({
        'url': req.url
      })
    } catch (error) {
      console.log(error)
    }

    res.write(`<!DOCTYPE html><html><head><title>${req.headers.host}</title></head><body>`)
    res.write(appString)
    res.end('<script src="/client.js"></script></body></html>')
  })

  /* app.get('/', (req, res) => {
    const vueApp = new Vue({
      'el':     'app',
      'render': (handle) => handle(appBase)
    })

    renderer.renderToString(vueApp, (error, html) => {
      if (error) {
        throw error
      }

      res.end(`
      <!DOCTYPE html>
      <html lang="en">
        <head><title>Hello</title></head>
        <body>${html}</body>
      </html>
      `)
    })
  }) */

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
