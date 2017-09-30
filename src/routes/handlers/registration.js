import {User, createUser} from '../../models/user'

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
      password
    })

    try {
      await createUser(newUser)
    } catch (error) {
      req.flash('msg:error', 'This e-mail address is already attached to an account')
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
