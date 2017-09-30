import passport from 'passport'
import {Strategy as LocalStrategy} from 'passport-local'
import {getUserByEmail, comparePassword, getUserById} from '../models/user'
import {handle} from '../utils/error-handler'

passport.use(
  new LocalStrategy({
    'usernameField': 'email',
    'passwordField': 'password'
  }, async (email, password, done) => {
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
