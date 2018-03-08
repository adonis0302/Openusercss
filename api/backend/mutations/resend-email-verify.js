import mustAuthenticate from '../../../lib/enforce-session'
import staticConfig from '../../../lib/config'
import jwt from 'jsonwebtoken'
import {
  sendEmail,
} from '../../email/mailer'

const createSendEmail = async ({email, displayname,}) => {
  const config = await staticConfig()
  const token = jwt.sign({
    email,
  }, config.get('keypair.clientprivate'), {
    'expiresIn': '1d',
    'issuer':    config.get('domain'),
    'algorithm': 'HS256',
  })

  let link = `https://openusercss.org/verify-email/${token}`

  if (process.env.NODE_ENV === 'development') {
    link = `http://localhost:5010/verify-email/${token}`
  }

  const result = await sendEmail({
    'to':       email,
    'template': 'email-verification-request',
    'locals':   {
      displayname,
      link,
    },
  })

  return result
}

export default async (root, {token,}, {Session,}) => {
  const session = await mustAuthenticate(token, Session)
  const result = await createSendEmail(session.user)

  return result.accepted[0] === session.user.email
}
