const express = require('express')
const router = express.Router()
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const log = require('chalk-console')

const User = require('../models/user')

// Register
router.get('/register', (req, res) => {
  res.render('register')
})

// Login
router.get('/login', (req, res) => {
  res.render('login')
})

// Register User
router.post('/register', (req, res) => {
  const {
    username,
    email,
    password
  } = req.body

  // Validation
  req.checkBody('email', 'Email is required').notEmpty()
  req.checkBody('email', 'Email is not valid').isEmail()
  req.checkBody('username', 'Username is required').notEmpty()
  req.checkBody('password', 'Password is required').notEmpty()
  req.checkBody('passwordverify', 'Passwords do not match').equals(password)

  const errors = req.validationErrors()

  if (errors) {
    res.render('register', {
      errors
    })
  } else {
    const newUser = new User({
      email,
      username,
      password
    })

    User.createUser(newUser, (err, user) => {
      if (err) {
        throw err
      }
    })

    req.flash('msg:success', 'You are registered and can now login')

    res.redirect('/users/login')
  }
})

passport.use(
  new LocalStrategy({
    'usernameField': 'email',
    'passwordField': 'password'
  },
  (email, password, done) => {
    User.getUserByEmail(email, (err, user) => {
      if (err) {
        throw err
      }
      if (!user) {
        return done(null, false, {'message': 'Invalid credentials'})
      }

      User.comparePassword(password, user.password, (error, isMatch) => {
        if (error) {
          throw error
        }
        if (isMatch) {
          return done(null, user)
        }
        return done(null, false, {'message': 'Invalid credentials'})
      })
    })
  }))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) => {
    done(err, user)
  })
})

router.post('/login',
  passport.authenticate('local', {'successRedirect': '/', 'failureRedirect': '/users/login', 'failureFlash': true}),
  (req, res) => {
    req.flash('msg:success', 'Login successful, welcome!')
    res.redirect('/')
  })

router.get('/logout', (req, res) => {
  req.logout()

  req.flash('msg:success', 'You are logged out')

  res.redirect('/users/login')
})

module.exports = router
