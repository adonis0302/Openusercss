import log from 'chalk-console'
import camo, {connect} from 'camo'
import {forOwn} from 'lodash'
import staticConfig from '../../shared/config'

import Theme from './schema/theme'
import User from './schema/user'
import Session from './schema/session'

const init = async () => {
  const config = await staticConfig()
  const connectionUrl = config.get('database.main')

  await connect(connectionUrl)

  const indexes = {
    'themes': [
      {
        'title':       'text',
        'description': 'text',
        'scope':       'text',
        'content':     'text'
      },
      {
        'weights': {
          'title':       10,
          'description': 6,
          'scope':       4,
          'content':     2
        }
      }
    ],
    'users': [
      {
        'displayname': 'text',
        'username':    'text'
      },
      {
        'weights': {
          'displayname': 1,
          'username':    1
        }
      }
    ]
  }

  try {
    forOwn(indexes, (value, key) => {
      camo.getClient().driver().ensureIndex(key, value[0], value[1])
    })
  } catch (error) {
    forOwn(indexes, (value, key) => {
      camo.getClient().driver().createIndex(key, value[0], value[1])
    })
  }

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
