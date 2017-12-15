import bcrypt from 'bcryptjs'
import log from 'chalk-console'
import {
  createTransport,
  sendEmail
} from '../../email/mailer'
import account from '../../.env'

const createSendEmail = async (user) => {
  const transportOptions = {
    'host':       account.smtp.host,
    'port':       account.smtp.port,
    'secure':     account.smtp.secure,
    'requireTls': true,
    'auth':       {
      'user': account.user,
      'pass': account.pass
    }
  }
  const transport = await createTransport(transportOptions)
  const result = await sendEmail(transport, {
    'to':       user.email,
    'template': 'registration',
    'locals':   {
      'displayname': user.displayname,
      // TODO Token
      'link':        'https://openusercss.org/verify-email/#token'
    }
  })

  return result
}

export default async (root, {displayname, email, password}, {User}) => {
  const saltRounds = 14
  const salt = await bcrypt.genSalt(saltRounds)
  const hash = await bcrypt.hash(password, salt)
  const newUser = User.create({
    'password': hash,
    'username': displayname.toLowerCase(),
    displayname,
    email
  })
  const savedUser = await newUser.save()

  await newUser.delete()

  createSendEmail(savedUser)
  .catch(log.error)

  return savedUser
}
