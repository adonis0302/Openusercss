// @flow
import 'babel-polyfill'

import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import expressValidator from 'express-validator'
import flash from 'connect-flash'
import session from 'express-session'
import passport from 'passport'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import log from 'chalk-console'
import {concat} from 'lodash'

import {handle} from './utils/error-handler'

import routes from './routes'
import usersRoute from './routes/users'
import settingsRoute from './routes/settings'
import graphqlRoute from './routes/graphql'

mongoose.Promise = global.Promise // eslint-disable-line

const init = async () => {
  mongoose.connect('mongodb://localhost/account-center', {
    'useMongoClient': true
  })
  // const db = mongoose.connection

  const app = express()

  const appSecret = await bcrypt.genSalt()

  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'pug')

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    'extended': false
  }))
  app.use(cookieParser())

  app.use(express.static(path.join(__dirname, 'public')))

  app.use(session({
    'secret':            appSecret,
    'saveUninitialized': true,
    'resave':            true
  }))

  app.use(passport.initialize())
  app.use(passport.session())

  app.use(expressValidator({
    'errorFormatter': (formParam, msg, value) => {
      const namespace = formParam.split('.')
      const root = namespace.shift()
      let param = root

      while (namespace.length) {
        param = `${param}[${namespace.shift()}]`
      }

      return {
        param,
        msg,
        value
      }
    }
  }))

  app.use(flash())

  app.use((req, res, next) => {
    res.locals.infoMsg = concat(
      req.flash('msg:info'),
      req.flash('msg:success')
    )
    res.locals.errorMsg = concat(
      req.flash('error'),
      req.flash('msg:error')
    )
    res.locals.user = req.user || null
    next()
  })

  app.use('/', routes)
  app.use('/users', usersRoute)
  app.use('/settings', settingsRoute)
  app.use('/graphql', graphqlRoute)

  app.set('port', 80)

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
