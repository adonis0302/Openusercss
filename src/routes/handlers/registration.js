import {User, createUser} from '../../models/user'
import hat from 'hat'
import {handle} from '../../utils/error-handler'

const registerHandler = async (req, res) => {
  const {
    username,
    email,
    password,
    displayname
  } = req.body

  // Validation
  req.checkBody('email', 'Email is required').notEmpty()
  req.checkBody('email', 'Email is not valid').isEmail()
  req.checkBody('displayname', 'Username is required').notEmpty()
  req.checkBody('password', 'Password is required').notEmpty()
  req.checkBody('passwordverify', 'Passwords do not match').equals(password)

  const errors = req.validationErrors()

  if (errors) {
    res.render('register', {
      'errorMsg': errors
    })
  } else {
    const newUser = new User({
      email,
      username,
      displayname,
      password,
      'apikey': hat()
    })

    try {
      await createUser(newUser)
    } catch (error) {
      handle(error)
      req.flash('msg:error', 'Submitted data rejected. This e-mail address and/or this username is already used.')
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
