import {Router as expressRouter} from 'express'
import log from 'chalk-console'
import {User, createUser, getUserByEmail} from '../models/user'
import passport from 'passport'
import {Strategy as LocalStrategy} from 'passport-local'

const router = expressRouter()

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', async (req, res) => {
  const {
    username,
    email,
    password
  } = req.body

  req.checkBody('username', 'Username is required').notEmpty()
  req.checkBody('email', 'E-mail is required').notEmpty()
  req.checkBody('email', 'E-mail is not a vaild address').isEmail()
  req.checkBody('password', 'Password can not be empty').notEmpty()
  req.checkBody('passwordverify', 'Passwords do not match').equals(password)

  const errors = req.validationErrors()
  let newUser = null

  if (errors) {
    res.render('register', {
      errors
    })
  } else {
    newUser = new User({
      username,
      email,
      password
    })

    try {
      await createUser(newUser)
    } catch (error) {
      req.flash('msg:error', 'A system error occurred')
      log.error('Error while creating user:')
      log.error(error)
      log.error(error.stack)
    }

    req.flash('msg:success', 'Registration successful')
    res.redirect('/users/login')
  }
})

router.get('/login', (req, res) => {
  res.render('login')
})

passport.use(new LocalStrategy((email, password, done) => {
  getUserByEmail({email}, (error, user) => {
    if (error) {
      return done(error)
      console.log(error)
    }

    if (!user || !user.validPassword(password)) {
      return done(null, false, {
        'message': 'Invalid credentials'
      })
    }

    return done(null, user)
  })
}))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.getUserById(id, (error, user) => {
    done(error, user)
  })
})

router.post('/login',
  passport.authenticate('local', {
    'successRedirect': '/',
    'failureRedirect': '/users/login',
    'failureFlash':    true
  }),
  (req, res) => {
    res.redirect('/')
  }
)

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('msg:success', 'Logged out')
  res.redirect('/users/login')
})

module.exports = router
