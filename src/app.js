import 'babel-polyfill'

import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
// import pugEngine from 'express-pug'
import expressValidator from 'express-validator'
import flash from 'connect-flash'
import session from 'express-session'
import passport from 'passport'
// import {LocalStrategy} from 'passport-local'
// import mongo from 'mongodb'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import log from 'chalk-console'

(async () => {
  mongoose.connect('mongodb://localhost/account-center')
  // const db = mongoose.connection

  const routes = require('./routes')
  const users = require('./routes/users')
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
    res.locals.successMsg = req.flash('msg:success')
    res.locals.errorMsg = req.flash('msg:error')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null
    next()
  })

  app.use('/', routes)
  app.use('/users', users)

  app.set('port', 80)

  app.listen(app.get('port'), () => {
    log.info(`App started on port ${app.get('port')}`)
  })
})()
