import {User, createUser} from '../../models/user'
import hat from 'hat'

const registerHandler = async (req, res) => {
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
      password,
      'apikey': hat()
    })

    try {
      await createUser(newUser)
    } catch (error) {
      req.flash('msg:error', 'Submitted data rejected. If you already used this e-mail address with an account, please log in with that one.')
      res.redirect('/users/register')
      return false
    }

    req.flash('msg:success', 'You are registered and can now login')
    res.redirect('/users/login')
  }
}

module.exports = {
  registerHandler
}
