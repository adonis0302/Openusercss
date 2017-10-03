// @flow

import {User} from '../../models/user'
import {handle} from '../../utils/error-handler'

const accountDeleteHandler = async (req, res) => {
  const user = await User.findOne({
    'email': req.user.email
  })

  try {
    req.logout()
    user.remove()
    req.flash('msg:success', 'Your account has been deleted.')
    return res.redirect('/users/login')
  } catch (error) {
    req.flash('msg:error', 'You account couldn\'t be deleted sue to an error, please contact the system administrator')
    handle(error)
  }
}

module.exports = {
  accountDeleteHandler
}
