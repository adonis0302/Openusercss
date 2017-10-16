// @flow
import 'babel-polyfill'

import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
// import expressValidator from 'express-validator'
import log from 'chalk-console'
import staticConfig from './config'

import {handle} from './utils/error-handler'
import setupRoutes from './routes'

const init = async () => {
  const app = express()
  const config = await staticConfig()

  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'pug')

  app.use(bodyParser.urlencoded({
    'extended': false
  }))
  app.use(cookieParser())

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
