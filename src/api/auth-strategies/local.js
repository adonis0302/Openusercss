// @flow

import passport from 'passport'
import {Strategy as LocalStrategy,} from 'passport-local'
import {getUserByEmail, comparePassword, getUserById,} from '../models/user'

passport.use(
  new LocalStrategy({
    'usernameField': 'email',
    'passwordField': 'password',
  }, async (email, password, done) => {
    const user = await getUserByEmail(null, {email,})

    if (!user) {
      return done(null, false, {'message': 'Invalid credentials',})
    }

    const matchedPassword = await comparePassword(password, user.password)

    if (matchedPassword) {
      return done(null, user)
    }

    return done(null, false, {'message': 'Invalid credentials',})
  })
)

passport.serializeUser(async (user, done) => {
  return done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  const user = await getUserById(null, {id,})

  return done(null, user)
})
