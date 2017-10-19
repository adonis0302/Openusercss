import log from 'chalk-console'
import {connect} from 'camo'

import Theme from './schema/theme'
import User from './schema/user'
import Session from './schema/session'

const connectionUrl = 'mongodb://localhost:27017/openusercss'

connect(connectionUrl)
.then(() => {
  log.info('Database connection established')
})

export default async () => {
  return {
    Theme,
    User,
    Session
  }
}
