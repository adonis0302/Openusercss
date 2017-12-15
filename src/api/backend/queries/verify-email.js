import staticConfig from '../../../shared/config'
import jwt from 'jsonwebtoken'
import pify from 'pify'

export default async (root, {token}, {User}) => {
  const config = await staticConfig()
  const decoded = await pify(jwt.verify)(token, config.get('keypair.clientprivate'))
  let result = false

  if (decoded.email) {
    const user = await User.findOne({
      'email': decoded.email
    })

    if (!user) {
      // Just in case we made an error by sending a verification link
      // to an address that we weren't meant to send one to.
      // This should never happen
      throw new Error('\nThis address does not exist.\nTo fix it, you must persist')
    }

    user.emailVerified = true
    user.save()

    result = true
  }

  return result
}
