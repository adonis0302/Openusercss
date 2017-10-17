// @flow
import 'babel-polyfill'

import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import log from 'chalk-console'
// import morgan from 'morgan'

import staticConfig from './config'
import {handle} from './shared/error-handler'
import setupRoutes from './routes'

const init = async () => {
  const app = express()
  const config = await staticConfig()

  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'pug')

  // app.use(morgan('combined'))
  app.use(bodyParser.urlencoded({
    'extended': false
  }))

  app.use(express.static(path.join(__dirname, 'client')))

  app.use(await setupRoutes())
  app.set('port', config.get('port'))

  log.info(`App environment: ${app.get('env')}`)

  app.listen(app.get('port'), () => {
    log.info(`App started on port ${app.get('port')}`)
  })

  return true
}

(async () => {
  try {
    await init()
  } catch (error) {
    handle(error)
  }
})()
