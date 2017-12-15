import bcrypt from 'bcryptjs'
import log from 'chalk-console'
import {escape} from 'html-escaper'
import {
  createTransport,
  sendEmail
} from '../../email/mailer'
import env from '../../.env'

const createSendEmail = async (user) => {
  const account = env.smtp
  const transportOptions = {
    'host':       account.host,
    'port':       account.port,
    'secure':     account.secure,
    'requireTls': true,
    'logger':     true,
    'debug':      true,
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
      'link':        'https://decentm.com'
    }
  })

  return result
}

export default async (root, {displayname, email, password}, {User}) => {
  const saltRounds = 14
  const salt = await bcrypt.genSalt(saltRounds)
  const hash = await bcrypt.hash(password, salt)
  const newUser = User.create({
    'password':    hash,
    'username':    escape(displayname).toLowerCase(),
    'displayname': escape(displayname),
    email
  })
  const savedUser = await newUser.save()

  await newUser.delete()
  try {
    createSendEmail(savedUser)
  } catch (error) {
    log.error(error)
  }

  return savedUser
}
