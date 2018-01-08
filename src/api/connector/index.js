import log from 'chalk-console'
import camo, {connect,} from 'camo'
import {forOwn,} from 'lodash'
import staticConfig from '../../shared/config'

import Theme, {Option,} from './schema/theme'
import User from './schema/user'
import Session from './schema/session'
import Rating from './schema/rating'

const init = async () => {
  const config = await staticConfig()
  const connectionUrl = config.get('database.main')

  await connect(connectionUrl)
  log.info('API database connection established')
  log.info('Rebuiding indexes')
  const indexes = {
    'themes': [
      {
        'title':       'text',
        'description': 'text',
        'content':     'text',
      },
      {
        'weights': {
          'title':       3,
          'description': 2,
          'content':     1,
        },
      },
    ],
    'users': [
      {
        'displayname': 'text',
        'username':    'text',
        'bio':         'text',
      },
      {
        'weights': {
          'displayname': 3,
          'username':    2,
          'bio':         1,
        },
      },
    ],
  }

  forOwn(await camo.getClient().driver().collections(), (value) => {
    value.dropIndexes()
  })

  forOwn(indexes, (value, key) => {
    camo.getClient().driver().ensureIndex(key, value[0], value[1])
  })

  log.info('API database initialization completed')
}

export default async () => {
  await init()

  return {
    Theme,
    User,
    Session,
    Option,
    Rating,
  }
}
