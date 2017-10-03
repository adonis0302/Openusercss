// @flow

import express from 'express'
import passport from 'passport'
import {registerHandler} from './handlers/registration'
import requireDir from 'require-dir'

const router = express.Router() // eslint-disable-line new-cap

router.get('/register', (req, res) => {
  res.render('register')
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/register', registerHandler)

requireDir('../auth-strategies')

router.post('/login',
  passport.authenticate('local', {
    'failureRedirect': '/users/login',
    'failureFlash':    true
  }), (req, res) => {
    res.redirect('/')
  })

router.get('/logout', (req, res) => {
  req.logout()

  req.flash('msg:success', 'You have been logged out')
  res.redirect('/users/login')
})

module.exports = router
