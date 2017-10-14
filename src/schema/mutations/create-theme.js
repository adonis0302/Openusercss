import mustAuthenticate from '../../utils/enforce-session'
import log from 'chalk-console'

export default async (root, {token, title, description, content}, {Logins, Themes, Users}) => {
  await mustAuthenticate(token, Logins)

  log.info('Creating theme')
  log.info(`Token: ${token}`)
  log.info(`User id: ${Logins.findOne({
    token
  })}`)

  return true
}
