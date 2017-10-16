import bcrypt from 'bcryptjs'
import log from 'chalk-console'

export default async (root, {displayname, email, password}, {Users}) => {
  const saltRounds = 14
  const newUser = {
    displayname,
    email
  }
  const saltStarted = Date.now()
  const salt = await bcrypt.genSalt(saltRounds)
  const hash = await bcrypt.hash(password, salt)

  log.info(`Salt generation took ${Date.now() - saltStarted}ms`)
  newUser.username = displayname.toLowerCase()
  newUser.password = hash
  const response = await Users.insert(newUser)

  return Object.assign({
    'id': response.insertedIds[0]
  }, newUser)
}
