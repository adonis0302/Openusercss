import bcrypt from 'bcryptjs'
import log from 'chalk-console'
import {escape} from 'html-escaper'

export default async (root, {displayname, email, password}, {User}) => {
  const saltRounds = 14
  const saltStarted = Date.now()
  const salt = await bcrypt.genSalt(saltRounds)
  const hash = await bcrypt.hash(password, salt)

  log.info(`Salt generation took ${Date.now() - saltStarted}ms`)
  const newUser = User.create({
    'password':    hash,
    'username':    escape(displayname).toLowerCase(),
    'displayname': escape(displayname),
    email
  })

  return newUser.save()
}
