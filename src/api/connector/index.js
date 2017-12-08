import log from 'chalk-console'
import camo, {connect} from 'camo'
import staticConfig from '../../shared/config'

import Theme from './schema/theme'
import User from './schema/user'
import Session from './schema/session'

const init = async () => {
  const config = await staticConfig()
  const connectionUrl = config.get('database.main')

  await connect(connectionUrl)

  camo.getClient().driver().ensureIndex('themes', {
    'title':       'text',
    'description': 'text',
    'scope':       'text',
    'content':     'text'
  }, {
    'weights': {
      'title':       10,
      'description': 6,
      'scope':       4,
      'content':     2
    }
  })

  camo.getClient().driver().ensureIndex('users', {
    'displayname': 'text',
    'username':    'text'
  }, {
    'weights': {
      'displayname': 1,
      'username':    1
    }
  })

  log.info('API database connection established')
}

export default async () => {
  await init()

  return {
    Theme,
    User,
    Session
  }
}
