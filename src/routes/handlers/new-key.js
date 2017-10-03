// @flow

import hat from 'hat'
import {User} from '../../models/user'

const newKeyHandler = async (req, res) => {
  const newApiKey = hat()
  const user = await User.findOne({
    'email': req.user.email
  })

  user.apikey = newApiKey
  user.save()

  return res.redirect('/settings')
}

module.exports = {
  newKeyHandler
}
