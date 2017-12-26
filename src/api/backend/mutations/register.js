import bcrypt from 'bcryptjs'
import log from 'chalk-console'
import jwt from 'jsonwebtoken'
import {
  sendEmail
} from '../../email/mailer'

import staticConfig from '../../../shared/config'

const createSendEmail = async ({email, displayname}) => {
  const config = await staticConfig()
  const token = jwt.sign({
    email
  }, config.get('keypair.clientprivate'), {
    'expiresIn': '1d',
    'issuer':    config.get('domain'),
    'algorithm': 'HS256'
  })

  let link = `https://openusercss.org/verify-email/${token}`

  if (process.env.NODE_ENV === 'development') {
    link = `http://localhost:5010/verify-email/${token}`
  }

  const result = await sendEmail({
    'to':       email,
    'template': 'verification',
    'locals':   {
      displayname,
      link
    }
  })

  return result
}

export default async (root, {displayname, email, password}, {User}) => {
  const config = await staticConfig()
  const salt = await bcrypt.genSalt(config.get('saltRounds'))
  const hash = await bcrypt.hash(password, salt)
  const newUser = User.create({
    'password': hash,
    'username': displayname.toLowerCase(),
    displayname,
    email
  })
  const savedUser = await newUser.save()

  createSendEmail(savedUser)
  .catch(log.error)

  return savedUser
}
