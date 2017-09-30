import express from 'express'
import passport from 'passport'
import {Strategy as LocalStrategy} from 'passport-local'
import {getUserByEmail, comparePassword, getUserById} from '../models/user'
import {registerHandler} from './handlers/registration'
import {handle} from '../utils/error-handler'

const router = express.Router() // eslint-disable-line new-cap

router.get('/register', (req, res) => {
  res.render('register')
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/register', registerHandler)

passport.use(
  new LocalStrategy({
    'usernameField': 'email',
    'passwordField': 'password'
  },
  async (email, password, done) => {
    let user = null
    let matchedPassword = null

    try {
      user = await getUserByEmail(email)
    } catch (error) {
      handle(error)
    }

    if (!user) {
      return done(null, false, {'message': 'Invalid credentials'})
    }

    try {
      matchedPassword = await comparePassword(password, user.password)
    } catch (error) {
      handle(error)
    }

    if (matchedPassword) {
      return done(null, user)
    }

    return done(null, false, {'message': 'Invalid credentials'})
  })
)

passport.serializeUser(async (user, done) => {
  return done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  let user = null

  try {
    user = await getUserById(id)
  } catch (error) {
    handle(error)
  }

  return done(null, user)
})

router.post('/login',
  passport.authenticate('local', {'failureRedirect': '/users/login', 'failureFlash': true}),
  (req, res) => {
    req.flash('msg:success', 'Login successful, welcome!')
    res.redirect('/')
  })

router.get('/logout', (req, res) => {
  req.logout()

  req.flash('msg:success', 'You have been logged out')
  res.redirect('/users/login')
})

module.exports = router
